export default function SecHead({ cmd, hash }: { cmd: string; hash: string }) {
  return (
    <div className="sec-head">
      <span className="sec-head__prompt">$</span>
      <span className="sec-head__cmd">{cmd}</span>
      <span className="sec-head__rule" />
      <span className="sec-head__hash">#{hash}</span>
    </div>
  );
}
