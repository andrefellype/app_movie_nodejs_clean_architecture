export default class DataReturnResponse {
    public static returnResolve(resolve, value) {
        return resolve(typeof value != "undefined" ? value : null)
    }

    public static returnReject(reject, value) {
        return reject(typeof value != "undefined" ? value : null)
    }
}