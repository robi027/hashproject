const port = 3000

module.exports = function(app){
    
    app.listen(port, (err) => {

        if (err) {
          return console.log('something bad happened', err)
        }
      
        console.log(`server is listening on ${port}`)
      })

}
