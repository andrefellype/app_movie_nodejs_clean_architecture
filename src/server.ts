import app from './app/config/app'

let PORT_LOCAL = 3333

app.listen(process.env.PORT || PORT_LOCAL)