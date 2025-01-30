"use client";

import { buttonStates } from "@/app/Manufacutre";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// import https from "https";
// import { IncomingMessage } from "http";

// const REGION = ""; // If German region, set this to an empty string: ''
// const BASE_HOSTNAME = "storage.bunnycdn.com";
// const HOSTNAME = REGION ? `${REGION}.${BASE_HOSTNAME}` : BASE_HOSTNAME;
// const STORAGE_ZONE_NAME = "wits-cdn";
// const FILENAME_TO_UPLOAD = "claimCards.json";
// const ACCESS_KEY = "eed68a17-ec3b-49b5-beb545ac3656-62a1-4e47";

export default function UploadingCards({
  state,
  changeState,
}: {
  state: Record<
    buttonStates,
    {
      active: boolean;
      disabled: boolean;
      success: boolean;
    }
  >;
  changeState: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<unknown>();

  useEffect(() => {
    if (receipt) {
      toast.success("Uploaded successfully");
      changeState();
    }
  }, [receipt]);

  // const uploadFile = async () => {
  //   const claimCardsData = localStorage.getItem("claimCards");
  //   if (!claimCardsData) {
  //     throw new Error("No data found in localStorage");
  //   }

  //   const header = {
  //     AccessKey: ACCESS_KEY,
  //   };

  //   const putOptions = {
  //     method: "PUT",
  //     host: HOSTNAME,
  //     path: `/${STORAGE_ZONE_NAME}///${FILENAME_TO_UPLOAD}`,
  //     headers: {
  //       ...header,
  //       "Content-Type": "application/json",
  //     },
  //   };

  //   const deleteOptions = {
  //     method: "DELETE",
  //     headers: {
  //       ...header,
  //     },
  //   };

  //   const purgeCacheOptions = {
  //     method: "POST",
  //     headers: {
  //       AccessKey:
  //         "93d36305-0986-4cc2-aaa0-3f412cf677e12096679b-8243-4bd3-9568-8445f2659bee",
  //       "content-type": "application/json",
  //     },
  //   };

  //   const deleted = await fetch(
  //     `https://storage.bunnycdn.com/${STORAGE_ZONE_NAME}///${FILENAME_TO_UPLOAD}`,
  //     deleteOptions,
  //   );

  //   if (deleted.ok) console.log("Deleted");

  //   const purgeCache = await fetch(
  //     "https://api.bunny.net/pullzone/3261736/purgeCache",
  //     purgeCacheOptions,
  //   );

  //   if (purgeCache.ok) console.log("Purged");

  //   return new Promise<void>((resolve, reject) => {
  //     const req = https.request(putOptions, (res: IncomingMessage) => {
  //       console.log("statusCode:", res.statusCode);
  //       console.log("headers:", res.headers);

  //       res.on("data", (d) => {
  //         process.stdout.write(d);
  //       });

  //       res.on("end", () => {
  //         resolve();
  //       });
  //     });

  //     req.on("error", (e) => {
  //       console.error(e);
  //       reject(e);
  //     });

  //     req.write(claimCardsData);
  //     req.end();
  //   });
  // };

  async function handleClaimCards() {
    setLoading(true);
    try {
      const claimCardsData = localStorage.getItem("claimCards");
      if (!claimCardsData) {
        toast.error("No data found");
        return;
      }

      const blob = new Blob([claimCardsData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "claimCards.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setReceipt(true);
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      disabled={state["Uploading"].disabled || loading}
      variant={
        state["Uploading"].success ? "success" : loading ? "loading" : "default"
      }
      onClick={handleClaimCards}
    >
      Upload JSON File
    </Button>
  );
}
