export const Rating = ({ rating }) => {
  const filledStars = Math.floor(rating)
  const emptyStars = 5 - filledStars

  return (
    <div className="d-flex align-items-center text-warning">
      {'★'.repeat(filledStars)}
      {'☆'.repeat(emptyStars)}
      <span className="ms-1 text-muted">({rating})</span>
    </div>
  )
}
