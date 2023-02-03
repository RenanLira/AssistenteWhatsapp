

export function handleTimestamp(time: number | Long.Long ) {

    if (typeof time === "object") return time.low * 1000

    return time * 1000

}