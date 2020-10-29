export const createRoom = (x, y) => {
    if (x > y) {
        return x + "+" + y
    }
    else {
        return y + "+" + x
    }
}