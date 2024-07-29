import dynamic from "next/dynamic";

const Location = dynamic(() => import('../components/Location'), {
  ssr: false
})

export default function Home() {
  return (
    <Location />
  );
}