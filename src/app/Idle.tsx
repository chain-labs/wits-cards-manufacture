"use client";

import { Button } from "@/components/ui/button";
import { useSelectedCardsTable } from "@/store";

export default function Idle({ resetStates }: { resetStates: () => void }) {
  const { clearAllListAndCards } = useSelectedCardsTable();
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center mb-8">
        Final Step: Upload to BunnyNet
      </h2>

      <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold mb-4">
          Follow these steps to complete the process:
        </h3>

        <ol className="list-decimal list-inside space-y-6">
          <li className="p-4 bg-white dark:bg-gray-800 rounded">
            Go to{" "}
            <a
              href="https://panel.bunny.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Bunny.net Dashboard
            </a>
          </li>

          <li className="p-4 bg-white dark:bg-gray-800 rounded">
            Navigate to{" "}
            <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              Storage → wits-cdn
            </span>
          </li>

          <li className="p-4 bg-white dark:bg-gray-800 rounded">
            Upload your file with these requirements:
            <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
              <li>
                Filename must be exactly:{" "}
                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  claimCards.json
                </span>
              </li>
              <li>Make sure to upload to the root directory</li>
              <li>Verify the file is accessible after upload</li>
            </ul>
          </li>
        </ol>

        <div className="mt-8 border-t pt-6">
          <p className="text-amber-600 dark:text-amber-400 mb-4">
            ⚠️ Important: Double check that the filename is exactly
            &quot;claimCards.json&quot; before proceeding
          </p>

          <Button
            onClick={() => {
              clearAllListAndCards();
              resetStates();
              window.location.reload();
            }}
            className="w-full"
          >
            I&apos;ve Completed All Steps - Start New Session
          </Button>
        </div>
      </div>
    </div>
  );
}
