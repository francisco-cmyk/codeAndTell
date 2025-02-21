export default function BackgroundImage(props: { image: string }) {
  return (
    <div
      className='absolute inset-0 bg-center bg-cover blur-lg brightness-75'
      style={{ backgroundImage: `url(${props.image})` }}
    ></div>
  );
}
