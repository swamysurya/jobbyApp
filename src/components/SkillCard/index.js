const SkillCard = props => {
  const {skillDetails} = props
  return (
    <li className="list-element">
      <img
        className="skill-image"
        src={skillDetails.imageUrl}
        alt={skillDetails.name}
      />
      <h1 className="skill-name">{skillDetails.name}</h1>
    </li>
  )
}

export default SkillCard
