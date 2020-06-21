export const filterKeysInObject = (objectToFilter, keysToReturn) => {
    const reducerObject = (accumulatedObject, currentKey) => (accumulatedObject[currentKey] = objectToFilter[currentKey], accumulatedObject)
    return keysToReturn.reduce(reducerObject, {});
}
