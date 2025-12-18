import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from './components/ui/button';

export default function BB84Simulator() {
  const [inputText, setInputText] = useState('');
  const [bases, setBases] = useState<string[]>([]);
  const [transmitted, setTransmitted] = useState(false);
  const [aliceBasisVisible, setAliceBasisVisible] = useState(true);
  const [bobBases, setBobBases] = useState<string[]>([]);

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
      setBobBases(new Array(binaryString.length).fill('+'));
    } else {
      setBases([]);
      setBobBases([]);
    }
    setTransmitted(false);
    setAliceBasisVisible(true);
  }, [binaryString]);

  // Toggle basis for a specific bit
  const toggleBasis = (index: number) => {
    setBases((prev) => {
      const newBases = [...prev];
      newBases[index] = newBases[index] === '+' ? '✕' : '+';
      return newBases;
    });
  };

  // Toggle Bob's basis
  const toggleBobBasis = (index: number) => {
    setBobBases((prev) => {
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
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            BB84 Quantum Key Distribution Simulator
          </h1>
          <p className="text-gray-600">
            Interactive simulation demonstrating quantum key distribution and
            eavesdropping detection
          </p>
        </div>

        <Card className="shadow-none mb-8">
          <CardContent className="flex flex-col gap-5">
            <CardTitle className="text-xl">Alice's Message</CardTitle>
            <CardDescription>
              Pretend that you are Alice and you want to send a secret message
              to Bob. First, you write your message which will be converted into
              bits (0s and 1s) for quantum operations.
            </CardDescription>

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
                      className="w-10 h-10 flex text-lg rounded-md cursor-"
                    >
                      {bit}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm">
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
              <CardTitle className="text-xl">Alice Choose Basis</CardTitle>
              <CardDescription>
                Now you (Alice) choose a random basses for each bit: +
                (rectilinear) or x (diagonal). This is like choosing a secret
                encoding for your message. You can select bases manually or
                randomize them. Once ready, click "Transmit" to send the qubits
                to Bob through the quantum channel.
              </CardDescription>
              {aliceBasisVisible ? (
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
              ) : (
                <div className="flex items-center justify-center py-2 text-muted-foreground">
                  <p>Alice's bases are hidden</p>
                </div>
              )}
              <div className="flex gap-2 justify-end">
                {transmitted && (
                  <Button
                    variant="outline"
                    onClick={() => setAliceBasisVisible(!aliceBasisVisible)}
                  >
                    {aliceBasisVisible ? 'Hide Bases' : 'Show Bases'}
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={() => {
                    setBases(
                      new Array(binaryString.length)
                        .fill(null)
                        .map(() => (Math.random() > 0.5 ? '+' : '✕'))
                    );
                  }}
                  disabled={transmitted}
                >
                  Randomize Bases
                </Button>
                <Button
                  onClick={() => {
                    setTransmitted(true);
                    setAliceBasisVisible(false);
                  }}
                  disabled={transmitted}
                >
                  Transmit
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        {transmitted && (
          <Card className="shadow-none mt-8">
            <CardContent className="flex flex-col gap-5">
              <CardTitle className="text-xl">Bob's Measurement Bases</CardTitle>
              <CardDescription>
                Bob receives your qubits but doesn't know which bases you used.
                He must randomly choose his own measurement bases (+ or x) to
                each qubit. When Bob's basis matches yours, he correctly
                measures the bit. When bases don't match, he gets a random
                result (50/50 chance).
              </CardDescription>
              <CardDescription>
                But… we don't have anyone else to role-play as Bob. You can ask
                a friend to do it, or… pretend you are Bob and try to measure
                the qubits without knowing the bases you just chose. Click
                "measure" when you are done :D
              </CardDescription>
              <div className="flex flex-wrap gap-1">
                {binaryString.split('').map((bit, index) => (
                  <Button
                    key={`bob-${index}-${bit}`}
                    onClick={() => toggleBobBasis(index)}
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 bg-white shadow-none cursor-pointer"
                  >
                    {bobBases[index] === '+' ? (
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
                    setBobBases(
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
                    console.log('Bob measuring with bases:', bobBases);
                  }}
                >
                  Measure
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
