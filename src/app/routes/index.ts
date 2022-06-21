import { Router } from 'express'
import UserRouter from './UserRouter'
import AboutUsRouter from './AboutUsRouter'
import CategoryRouter from './CategoryRouter'
import DirectorRouter from './DirectorRouter'
import ActorRouter from './ActorRouter'
import CountryRouter from './CountryRouter'
import StreamRouter from './StreamRouter'
import MovieRouter from './MovieRouter'
import TvShowRouter from './TvShowRouter'
import TvShowSeasonRouter from './TvShowSeasonRouter'
import TvShowEpisodeRouter from './TvShowEpisodeRouter'
import MyMovieRouter from './MyMovieRouter'
import MyTvShowRouter from './MyTvShowRouter'

const routes = Router()

routes.get("/", (res, req) => {
    return req.status(200).send("welcome app fest api")
})

UserRouter.getRoutes(routes)
AboutUsRouter.getRoutes(routes)
CategoryRouter.getRoutes(routes)
DirectorRouter.getRoutes(routes)
ActorRouter.getRoutes(routes)
CountryRouter.getRoutes(routes)
StreamRouter.getRoutes(routes)
MovieRouter.getRoutes(routes)
TvShowRouter.getRoutes(routes)
TvShowSeasonRouter.getRoutes(routes)
TvShowEpisodeRouter.getRoutes(routes)
MyMovieRouter.getRoutes(routes)
MyTvShowRouter.getRoutes(routes)

export default routes
