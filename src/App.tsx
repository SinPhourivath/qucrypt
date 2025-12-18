import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from './components/ui/button';

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
                    <Badge
                      key={`${index}-${bit}`}
                      variant="outline"
                      className="w-10 h-10 flex font-mono text-lg rounded-md cursor-"
                    >
                      {bit}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm ">
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
                  <Button
                    key={`${index}-${bit}`}
                    onClick={() => toggleBasis(index)}
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 bg-white shadow-none cursor-pointer"
                  >
                    {bases[index] === '+' ? (
                      <Plus className="w-6 h-6" />
                    ) : (
                      <X className="w-6 h-6" />
                    )}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setBases(
                      new Array(binaryString.length)
                        .fill(null)
                        .map(() => (Math.random() > 0.5 ? '+' : '✕'))
                    );
                  }}
                >
                  Randomize Bases
                </Button>
                <Button
                  onClick={() => {
                    console.log('Transmitting with bases:', bases);
                  }}
                >
                  Transmit
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
