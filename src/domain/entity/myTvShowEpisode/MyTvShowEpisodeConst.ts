import MyTvShow from "./MyTvShowEpisode"

export const MY_TV_SHOW_EPISODES_NAME_OBJECT = "my_tv_show_episodes"

export function MyTvShowEpisodeSetObjectDB(userId: object, tvShowIdValue: object, seasonIdValue: object, episodeIdValue: object, createdAtValue: string, updatedAtValue: string | null = null) {
    return {
        user_id: userId,
        tv_show_id: tvShowIdValue,
        tv_show_season_id: seasonIdValue,
        tv_show_episode_id: episodeIdValue,
        created_at: createdAtValue,
        updated_at: updatedAtValue
    }
}

export function MyTvShowEpisodeGetObjectForJson(myTvShow: MyTvShow) {
    return {
        _id: myTvShow._id,
        user_id: myTvShow.user_id,
        tv_show_key: myTvShow.tv_show_id,
        tv_show_season_id: myTvShow.tv_show_season_id,
        tv_show_episode_id: myTvShow.tv_show_episode_id,
        created_at: myTvShow.created_at,
        updated_at: myTvShow.updated_at,
        tvShow: null
    }
}