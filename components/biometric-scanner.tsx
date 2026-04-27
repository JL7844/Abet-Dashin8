'use client'

import { useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, CheckCircle2, Loader2, Camera, RotateCcw } from 'lucide-react'

type ScanDirection = 'front' | 'left' | 'right'

interface BiometricScannerProps {
  onScanComplete: (scans: { front: string; left: string; right: string }) => void
  onSkip?: () => void
}

export function BiometricScanner({ onScanComplete, onSkip }: BiometricScannerProps) {
  const [currentDirection, setCurrentDirection] = useState<ScanDirection>('front')
  const [isScanning, setIsScanning] = useState(false)
  const [scans, setScans] = useState<{ front?: string; left?: string; right?: string }>({})
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const directions: { key: ScanDirection; label: string; instruction: string }[] = [
    { key: 'front', label: 'Face Front', instruction: 'Look straight at the camera' },
    { key: 'left', label: 'Face Left', instruction: 'Turn your head to the left' },
    { key: 'right', label: 'Face Right', instruction: 'Turn your head to the right' },
  ]

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      setError('Unable to access camera. Please allow camera permissions.')
      console.error('[v0] Camera access error:', err)
    }
  }, [])

  const captureScan = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsScanning(true)
    try {
      // Simulate face detection delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      const context = canvasRef.current.getContext('2d')
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)
        const imageData = canvasRef.current.toDataURL('image/jpeg')

        setScans(prev => ({
          ...prev,
          [currentDirection]: imageData,
        }))

        // Move to next direction or complete
        const nextDirectionIndex = directions.findIndex(d => d.key === currentDirection) + 1
        if (nextDirectionIndex < directions.length) {
          const nextDirection = directions[nextDirectionIndex].key
          setCurrentDirection(nextDirection)
        } else {
          // All scans complete
          if (scans.front && scans.left && scans.right) {
            onScanComplete({
              front: scans.front,
              left: scans.left,
              right: scans.right,
            })
          }
        }
      }
    } catch (err) {
      setError('Failed to capture scan. Please try again.')
      console.error('[v0] Capture error:', err)
    } finally {
      setIsScanning(false)
    }
  }, [currentDirection, directions, scans, onScanComplete])

  const resetScans = () => {
    setScans({})
    setCurrentDirection('front')
    setError(null)
  }

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
    }
  }, [])

  const progress = (Object.keys(scans).length / directions.length) * 100

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Face Biometric Scan
        </CardTitle>
        <CardDescription>
          We need to capture your face from 3 angles for security
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Scan Progress</span>
            <span className="text-xs text-muted-foreground">{Object.keys(scans).length}/3</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Directions */}
        <div className="space-y-2">
          {directions.map(dir => (
            <div
              key={dir.key}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                currentDirection === dir.key
                  ? 'border-primary bg-primary/5'
                  : scans[dir.key]
                  ? 'border-success/50 bg-success/5'
                  : 'border-muted'
              }`}
            >
              <div>
                {scans[dir.key] ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : currentDirection === dir.key ? (
                  <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-muted" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{dir.label}</p>
                <p className="text-xs text-muted-foreground">{dir.instruction}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Video Feed */}
        {!scans.front && (
          <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              onLoadedMetadata={startCamera}
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          {Object.keys(scans).length === 3 ? (
            <>
              <Button
                variant="outline"
                onClick={resetScans}
                className="flex-1 gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Rescan
              </Button>
              <Button
                onClick={() =>
                  onScanComplete({
                    front: scans.front!,
                    left: scans.left!,
                    right: scans.right!,
                  })
                }
                className="flex-1"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Continue
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  stopCamera()
                  onSkip?.()
                }}
                className="flex-1"
              >
                Skip for Now
              </Button>
              <Button
                onClick={captureScan}
                disabled={isScanning}
                className="flex-1 gap-2"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4" />
                    Capture
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
