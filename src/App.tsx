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
import { ModeToggle } from './components/mode-toggle';
import { ThemeProvider } from './components/theme-provider';
import { Button } from './components/ui/button';

export default function BB84Simulator() {
  const [inputText, setInputText] = useState('');
  const [bases, setBases] = useState<string[]>([]);
  const [transmitted, setTransmitted] = useState(false);
  const [aliceBasisVisible, setAliceBasisVisible] = useState(true);
  const [bobBases, setBobBases] = useState<string[]>([]);
  const [measured, setMeasured] = useState(false);
  const [bobMeasurements, setBobMeasurements] = useState<string[]>([]);
  const [compared, setCompared] = useState(false);
  const [results, setResults] = useState(false);

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
    setMeasured(false);
    setCompared(false);
    setResults(false);
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

  const matchingIndices = bases
    .map((basis, index) => (basis === bobBases[index] ? index : null))
    .filter((i): i is number => i !== null);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="min-h-screen w-full">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Title */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
                  BB84 Quantum Key Distribution Simulator
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Interactive simulation demonstrating quantum key distribution
                  and eavesdropping detection
                </p>
              </div>
              <ModeToggle />
            </div>
          </div>

          {/* Alice's Message Card */}
          <Card className="shadow-none mb-8">
            <CardContent className="flex flex-col gap-5">
              <CardTitle className="text-xl">Alice's Secret Key</CardTitle>
              <CardDescription>
                Pretend that you are Alice and you want to send a secret message
                to Bob. First, you write your message which will be converted
                into bits (0s and 1s) for quantum operations.
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

          {/* Alice's Basis Card */}
          {inputText && (
            <Card className="shadow-none">
              <CardContent className="flex flex-col gap-5">
                <CardTitle className="text-xl">
                  Alice's Transmission Bases
                </CardTitle>
                <CardDescription>
                  Now you (Alice) choose a random basses for each bit: +
                  (rectilinear) or x (diagonal). This is like choosing a secret
                  encoding for your message. You can select bases manually or
                  randomize them. Once ready, click "Transmit" to send the
                  qubits to Bob through the quantum channel.
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

          {/* Bob's Basis Card */}
          {transmitted && (
            <Card className="shadow-none mt-8">
              <CardContent className="flex flex-col gap-5">
                <CardTitle className="text-xl">
                  Bob's Measurement Bases
                </CardTitle>
                <CardDescription>
                  Bob receives your qubits but doesn't know which bases you
                  used. He must randomly choose his own measurement bases (+ or
                  x) to each qubit. When Bob's basis matches yours, he correctly
                  measures the bit. When bases don't match, he gets a random
                  result (50/50 chance).
                </CardDescription>
                <CardDescription>
                  But… we don't have anyone else to role-play as Bob. You can
                  ask a friend to do it, or… pretend you are Bob and try to
                  measure the qubits without knowing the bases you just chose.
                  Click "measure" when you are done :D
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
                      const measurements = binaryString
                        .split('')
                        .map((bit, index) => {
                          if (bases[index] === bobBases[index]) {
                            return bit;
                          } else {
                            return Math.random() > 0.5 ? '1' : '0';
                          }
                        });
                      setBobMeasurements(measurements);
                      setMeasured(true);
                    }}
                  >
                    Measure
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bob's Measurement Results Card */}
          {measured && (
            <Card className="shadow-none mt-8">
              <CardContent className="flex flex-col gap-5">
                <CardTitle className="text-xl">
                  Bob's Measurement Results
                </CardTitle>
                <CardDescription>
                  Now you (Bob) has measured the qubits using the chosen bases.
                  Here are the results you got. Some bits might be correct, and
                  some might be wrong depending on whether the bases matched
                  Alice's.
                </CardDescription>
                <div className="flex flex-wrap gap-1">
                  {bobMeasurements.map((bit, index) => (
                    <Badge
                      key={`${index}-${bit}`}
                      variant="outline"
                      className="w-10 h-10 flex text-lg rounded-md"
                    >
                      {bit}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="default" onClick={() => setCompared(true)}>
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bases Comparison Card */}
          {compared && (
            <Card className="shadow-none mt-8">
              <CardContent className="flex flex-col gap-5">
                <CardTitle className="text-xl">Bases Comparison</CardTitle>
                <CardDescription>
                  Now, how do we get the correct result you may ask? At this
                  stage, Bob will publicly announce his bases, and alice will
                  say which position is match.
                </CardDescription>
                <CardDescription>
                  The key points here are:
                  <p> - Bob reveals only his bases, not the measured bits</p>
                  <p> - He can share this in a classical channel</p>
                </CardDescription>
                <div className="space-y-4">
                  {/* Bob's Bases */}
                  <p className="text-sm font-medium mb-2">Bob's Bases:</p>
                  <div className="flex flex-wrap gap-1">
                    {binaryString.split('').map((bit, index) => (
                      <Button
                        key={`bob-${index}-${bit}`}
                        variant="outline"
                        size="icon"
                        className="w-10 h-10 bg-white shadow-none"
                      >
                        {bobBases[index] === '+' ? (
                          <Plus className="w-6 h-6" />
                        ) : (
                          <X className="w-6 h-6" />
                        )}
                      </Button>
                    ))}
                  </div>

                  <p className="text-sm font-medium mb-2">
                    Alice says the correct bases are index:{' '}
                  </p>

                  <p className="text-sm">
                    {matchingIndices.length > 0
                      ? matchingIndices.join(', ')
                      : 'None'}
                  </p>

                  {/* Match indicator */}
                  <p className="text-sm">
                    <span className="font-semibold">Matching bases:</span>{' '}
                    {
                      bases.filter((basis, index) => basis === bobBases[index])
                        .length
                    }{' '}
                    out of {bases.length}
                  </p>

                  <div className="flex gap-2 justify-end">
                    <Button variant="default" onClick={() => setResults(true)}>
                      Continue
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Result Card */}
          {results && (
            <Card className="shadow-none mt-8">
              <CardContent className="flex flex-col gap-5">
                <CardTitle className="text-xl">Result</CardTitle>
                <CardDescription>
                  After knowing the correct bases, Bob discards all bits
                  measured with mismatched bases and keeps only the remaining
                  bits as the shared secret key. This is called{' '}
                  <span className="text-primary">Basis Sifting</span>.
                </CardDescription>
                <CardDescription>
                  You may ask why we need to do this. Remember that the wrong
                  bases measure qubits in random (50/50), there is no way of
                  knowing if those bits are correct or not, so we must discard
                  them.
                </CardDescription>
                <div className="space-y-4">
                  {/* Bob's Correct Bases */}
                  <p className="text-sm font-medium mb-2">
                    Bob's Correct Bases:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {bobBases.map((basis, index) => (
                      <Button
                        key={`${index}-${bases}`}
                        variant="outline"
                        size="icon"
                        className={`w-10 h-10 shadow-none bg-white hover:bg-transparent cursor-default ${
                          bases[index] === bobBases[index] ? '' : 'opacity-30'
                        }`}
                      >
                        {basis === '+' ? (
                          <Plus className="w-6 h-6" />
                        ) : (
                          <X className="w-6 h-6" />
                        )}
                      </Button>
                    ))}
                  </div>

                  {/* Bob's Measurement */}
                  <p className="text-sm font-medium mb-2">Bob's Measurement:</p>
                  <div className="flex flex-wrap gap-1">
                    {bobMeasurements.map((bit, index) => (
                      <Badge
                        key={`${index}-${bit}`}
                        variant="outline"
                        className={`w-10 h-10 flex text-lg rounded-md ${
                          bases[index] === bobBases[index] ? '' : 'opacity-30'
                        }`}
                      >
                        {bit}
                      </Badge>
                    ))}
                  </div>

                  {/* Usable Key */}
                  <p className="text-sm font-medium mb-2">Usable Key:</p>
                  <div className="flex flex-wrap gap-1">
                    {bobMeasurements
                      .map((bit, index) => ({ bit, index }))
                      .filter(({ index }) => bases[index] === bobBases[index])
                      .map(({ bit, index }) => (
                        <Badge
                          key={`${index}-${bit}`}
                          variant="outline"
                          className="w-10 h-10 flex text-lg rounded-md"
                        >
                          {bit}
                        </Badge>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Explanation */}
          <div className="mt-8">
            <div className="flex justify-between items-start">
              <p>Notable confusing concepts:</p>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
