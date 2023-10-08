type IconProps = {
  style?: React.CSSProperties,
  color: string
  classes: string
  name: string
}

function Icon(props: IconProps) {
  const style = props.style ?? {}; 

  return (
    <svg className={props.classes} preserveAspectRatio="none" style={style ? style : undefined}  fill={props.color}>
        <use href={`/icons.svg#${props.name}`} />
    </svg>
  )
}

export default Icon
