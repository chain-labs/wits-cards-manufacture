import { useSelectedCardsTable } from "@/store";
import Table from "./Table";
import { CardWithQuantity } from "@/types";
import { Button } from "./ui/button";

function CardName({
  card,
}: {
  card: CardWithQuantity & { disabled: boolean };
}) {
  const { removeCard } = useSelectedCardsTable();
  return (
    <p className="flex justify-center items-center gap-2">
      <Button
        className="text-red-500 disabled:bg-slate-300"
        onClick={() => removeCard(card)}
        size="sm"
        variant="secondary"
        disabled={card.disabled}
      >
        x
      </Button>
      {card.tid}
    </p>
  );
}

function CardQuantity({
  card,
}: {
  card: CardWithQuantity & { disabled: boolean };
}) {
  const { upadteCardQuantity } = useSelectedCardsTable();
  return (
    <div className="flex justify-center items-center gap-2 w-full">
      <Button
        onClick={() => upadteCardQuantity(card, card.quantity - 1)}
        size="sm"
        variant="secondary"
        disabled={card.quantity <= 1 || card.disabled}
        className="disabled:bg-slate-300"
      >
        -
      </Button>
      <p>{card.quantity}</p>
      <Button
        onClick={() => upadteCardQuantity(card, card.quantity + 1)}
        size="sm"
        variant="secondary"
        disabled={card.disabled}
        className="disabled:bg-slate-300"
      >
        +
      </Button>
    </div>
  );
}

export default function TableWithCardData() {
  const { list, disableUpdate } = useSelectedCardsTable();

  return (
    <Table
      header={["Name", "Quantity"]}
      body={list.map((card) => [
        <CardName key={card.id} card={{ ...card, disabled: disableUpdate }} />,
        <CardQuantity
          key={card.id}
          card={{ ...card, disabled: disableUpdate }}
        />,
      ])}
    />
  );
}
