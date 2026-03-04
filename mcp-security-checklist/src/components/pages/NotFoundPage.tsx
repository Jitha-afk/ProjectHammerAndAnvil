import FuzzyText from '@/components/FuzzyText'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
      <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover={true}>
        404
      </FuzzyText>
      <FuzzyText
        baseIntensity={0.15}
        hoverIntensity={0.4}
        enableHover={true}
        fontSize="clamp(1rem, 3vw, 2rem)"
        fontWeight={600}
      >
        Page Not Found
      </FuzzyText>
      <p className="text-muted-foreground max-w-md text-center mt-2">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a href="#/">
        <Button variant="outline" size="sm" className="mt-4">
          Go Home
        </Button>
      </a>
    </div>
  )
}
