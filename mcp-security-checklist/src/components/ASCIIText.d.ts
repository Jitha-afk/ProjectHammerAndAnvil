interface ASCIITextProps {
  text?: string
  asciiFontSize?: number
  textFontSize?: number
  textColor?: string
  planeBaseHeight?: number
  enableWaves?: boolean
}

declare const ASCIIText: React.FC<ASCIITextProps>
export default ASCIIText
