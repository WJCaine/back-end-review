exports.formatDates = list => {
  newList = [...list]
  return newList.map(obj => {
    const newObj = { ...obj }
    let formatDate = new Date(newObj.created_at)
    newObj.timestamp = formatDate;
    delete newObj.created_at
    return newObj;
  })

};

exports.makeRefObj = (list, key, value) => {
  let returnObj = {};
  list.forEach(object => {
    returnObj[object[key]] = object[value]
  })
  return returnObj;
};

exports.formatComments = (comments, articleRef) => {

  const formattedComments = [...comments]
  return formattedComments.map(object => {
    let newObject = { ...object }
    newObject.author = newObject.created_by
    delete newObject.created_by
    newObject.article_id = articleRef[newObject.belongs_to]
    delete newObject.belongs_to
    newObject.created_at = new Date(newObject.created_at)
    return newObject
  })
};
