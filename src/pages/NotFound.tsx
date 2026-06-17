import sad from "../assets/sadMeme.jpg";
import { Button } from "../components/UI/Button";

export function NotFound() {
  return (
    <div className="bg-image px-5 w-screen h-screen flex items-center justify-center">
      <div className="bg-white flex flex-col items-center justify-center p-8 rounded-2xl gap-8">
        <h1 className="text-lg md:text-xl">Ops... Essa página não existe</h1>
        <img src={sad} alt="" className=" w-30 md:w-50" />
        <a href="/" className="w-full">
          <Button variant="dark">
            Voltar para o início
          </Button>
        </a>
      </div>
    </div>
  );
}
