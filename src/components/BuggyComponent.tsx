function BuggyComponent({
  shouldThrowError = false,
}: {
  shouldThrowError?: boolean;
}) {
  const [explode, setExplode] = useState(false);

  if (shouldThrowError && explode) {
    throw new Error("Boom! 💥");
  }

  return (
    <div>
      <p>I'm a potentially unstable component...</p>
      <button onClick={() => setExplode(true)}>Trigger Error</button>
    </div>
  );
}

export default BuggyComponent;
