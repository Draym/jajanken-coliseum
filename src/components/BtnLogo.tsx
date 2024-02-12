export type BtnLogoType = {
    img: string
    redirection: string
    className?: string
}

export default function BtnLogo({img, redirection, className}: BtnLogoType) {
    return (
        <a href={redirection} target="_blank" rel="noopener noreferrer">
            <img className={className} alt="" src={img}/>
        </a>
    )
}