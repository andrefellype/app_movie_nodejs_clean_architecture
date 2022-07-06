import AboutUs from "../../entity/aboutUs/AboutUs"

export default interface AboutUsRepository {
    deleteAll(): Promise<boolean>

    updateAll(data: object): Promise<boolean>
    
    findLast(): Promise<AboutUs | null>
}