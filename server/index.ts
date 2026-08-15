import app from "./src/app.js"
import connectToDb from "./src/config/connetDb.js"

const PORT = process.env.PORT || 3000;

if (!PORT){
    throw new Error("please ensure that a port is provided")
}

connectToDb().
then(() => {
    startServer()
})
.catch((error) => {

  console.log("Failed to connect to MongoDB:", error)
 
})
function startServer(){
    app.listen(PORT, (error?: Error) => {
        if (error) {
            console.log("Cannot connect to the server", error)
        } else {
            console.log(`Server is running on port ${PORT}`)
        }
    })
}