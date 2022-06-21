import AboutUs from "../../entity/aboutUs/AboutUs"

export default interface AboutUsRepository {
    deleteAll(): Promise<boolean>
    update(data: object): Promise<boolean>
    openLast(): Promise<AboutUs | null>
}