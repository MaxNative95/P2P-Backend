
const greeting = (req, res, next) => {
    try {
        return res.json({
            message : "Hello Web3"
        });
    } catch (error) {
        throw new Error("Error :", error);
    }
}

module.exports = greeting;