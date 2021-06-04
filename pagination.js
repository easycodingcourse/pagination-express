const getRouterInfo = (req) => {
    const protocol = !req.protocol ? "https" : req.protocol;
    const host = !req.hostname ? req.headers.host : req.hostname;
    const originalUrl = !req.originalUrl ? req.url : req.originalUrl;
  
    const fullUrl = protocol + "://" + host + originalUrl;
    const urlWithoutParams = fullUrl.split("?").shift();
    return urlWithoutParams;
  };
  
  const getOffset = (page, limit) => {
    !limit ? (limit = 20) : null;
    !page ? (page = 1) : null;
    page = parseInt(page);
    limit = parseInt(limit);
    page === 0 ? (page = 1) : null;
    return parseInt((offset = (page - 1) * limit));
  };
  
  function doPaging(currentPage, range, totalPages, start = 1) {
    let paging = [];
  
    range > totalPages ? (range = totalPages) : null;
  
    if (currentPage < range / 2 + 1) {
      start = 1;
    } else if (currentPage >= totalPages - range / 2) {
      start = Math.floor(totalPages - range + 1);
    } else {
      start = currentPage - Math.floor(range / 2);
    }
  
    for (let i = start; i <= start + range - 1; i++) {
      if (i === currentPage) {
        // paging.push(`[${i}]`); // add brackets to indicate current page
        paging.push({
          active: true,
          page: i,
        });
      } else {
        // paging.push(i.toString());
        paging.push({
          active: false,
          page: i,
        });
      }
    }
    return paging;
  }
  
  const getmetatag = ({ req, page, limit, total, foundList = null, range }) => {
    const urlWithoutParams = getRouterInfo(req);
    let totalPage = Math.ceil(total / limit);
    if (totalPage < page) return { status: false, error: "page not found...." };
    let previousPageCount = page - 1;
    let previousPageUrl =
      urlWithoutParams + "?page=" + previousPageCount + "&limit=" + limit;
    previousPageCount === 0 ? (previousPageCount = null) : null;
    let nextPageCount = page + 1;
    let nextPageUrl =
      urlWithoutParams + "?page=" + nextPageCount + "&limit=" + limit;
    nextPageCount > totalPage ? (nextPageCount = null) : null;
  
    var ranges = null;
    if (range) {
      ranges = doPaging(page, range, totalPage, page - 1 * limit);
    }
  
    metatag = {
      status: true,
      totalList: total,
      currentList: foundList,
      totalPage: totalPage,
      hasNextPage: nextPageCount === null ? false : true,
      hasPreviousPage: previousPageCount === null ? false : true,
      page: {
        totalPage: totalPage,
        currentPage: page,
        nextPage: nextPageCount,
        previousPage: previousPageCount,
      },
      currentPage: {
        page,
        url: urlWithoutParams + "?page=" + page + "&limit=" + limit,
      },
      nextPage: {
        page: nextPageCount,
        url: nextPageCount === null ? null : nextPageUrl,
      },
      previousPage: {
        page: previousPageCount,
        url: previousPageCount === null ? null : previousPageUrl,
      },
      paging: ranges,
    };
  
    !foundList ? delete metatag.foundList : null;
    !range ? delete metatag.pageing : null;
    return metatag;
  };
  
  const pagination = async (
    Model,
    { req, page, limit, metatags, lists, range },
    query,
    callback
  ) => {
    !metatags ? (metatags = "metatags") : null;
    !lists ? (lists = "lists") : null;
  
    if (!page) {
      if (!callback) {
        return {
          status: false,
          error: "give a page ",
        };
      } else {
        callback({
          status: false,
          error: "give a page ",
        });
      }
    }
  
    page = parseInt(page);
    limit = parseInt(limit);
    let offset = getOffset(page, limit);
  
    const data = await Model.findAndCountAll({
      ...query,
      offset,
      limit,
    }).catch((error) => {
      console.log(error);
      if (!callback) {
        return { status: false, error: error };
      } else {
        callback({ status: false, error: error });
      }
    });
  
    const rows = data.rows;
  
    const metaObject = {
      req: req,
      page: page,
      limit: limit,
      total: data.count,
      foundList: rows.length,
      range: range,
    };
  
    !range ? delete metaObject.range : null;
    const mts = getmetatag(metaObject);
  
    const response = {};
    response[metatags] = mts;
    response[lists] = rows;
  
    if (!callback) {
      return response;
    } else {
      callback(response);
    }
  };
  
  module.exports = {
    getOffset,
    getmetatag,
    pagination,
  };
  
  // module.exports = pagination;
  