import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function BB84Simulator() {
  const [inputText, setInputText] = useState('');
  const [bases, setBases] = useState<string[]>([]);

  // Convert text to binary
  const textToBinary = (text: string) => {
    return text
      .split('')
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join('');
  };

  const binaryString = inputText ? textToBinary(inputText) : '';

  // Initialize bases array when binary string changes
  useEffect(() => {
    if (binaryString) {
      setBases(new Array(binaryString.length).fill('+'));
    } else {
      setBases([]);
    }
  }, [binaryString]);

  // Toggle basis for a specific bit
  const toggleBasis = (index: number) => {
    setBases((prev) => {
      const newBases = [...prev];
      newBases[index] = newBases[index] === '+' ? '✕' : '+';
      return newBases;
    });
  };

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            BB84 Quantum Key Distribution Simulator
          </h1>
          <p className="text-gray-600">
            Interactive simulation demonstrating quantum key distribution and
            eavesdropping detection
          </p>
        </div>

        <Card className="shadow-none mb-8">
          <CardContent className="flex flex-col gap-5">
            <CardTitle className="text-xl">Enter Text</CardTitle>

            <Input
              id="text-input"
              type="text"
              placeholder="Type your message here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />

            {/* Binary Display */}
            {inputText && (
              <>
                <div className="flex flex-wrap gap-1">
                  {binaryString.split('').map((bit, index) => (
                    <div
                      key={`${index}-${bit}`}
                      className="w-10 h-10 flex items-center justify-center bg-white border-2 border-gray-300 rounded-md font-mono font-bold text-lg"
                    >
                      {bit}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Total bits:</span>{' '}
                  {binaryString.length}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {inputText && (
          <Card className="shadow-none">
            <CardContent className="flex flex-col gap-5">
              <CardTitle className="text-xl">Choose Basis</CardTitle>
              <div className="flex flex-wrap gap-1">
                {binaryString.split('').map((bit, index) => (
                  <button
                    type="button"
                    key={`${index}-${bit}`}
                    onClick={() => toggleBasis(index)}
                    className="w-10 h-10 flex items-center justify-center bg-white border-2 border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    {bases[index] === '+' ? (
                      <Plus className="w-6 h-6" />
                    ) : (
                      <X className="w-6 h-6" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
