/**
 * Returns the port value as a number.
 * If the entered value is not a number, return as it is.
 * @param val The port value
 * @returns A numeric port value or the original value if not a number
 */
export default (val: string | number): number | string | boolean => {
    const port = Number(val);
    if (isNaN(port)) {
    return val;
    }
    if (port >= 0) {
    return port;
    }
    return false;
}
    

