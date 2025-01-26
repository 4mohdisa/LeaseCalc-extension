import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { RentCalculator } from './calculators/rent-calculator'
import { AdvertisingFeeCalculator } from './calculators/advertising-fee'
import { RelettingFeeCalculator } from './calculators/reletting-fee'

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-4">
        <Card className="w-full mx-auto">
          <CardContent className="p-6">
            <Tabs defaultValue="rent" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="rent">Rent Calculator</TabsTrigger>
                <TabsTrigger value="advertising">Advertising Fee</TabsTrigger>
                <TabsTrigger value="reletting">Reletting Fee</TabsTrigger>
              </TabsList>
              <div className="mt-6">
                <TabsContent value="rent">
                  <RentCalculator />
                </TabsContent>
                <TabsContent value="advertising">
                  <AdvertisingFeeCalculator />
                </TabsContent>
                <TabsContent value="reletting">
                  <RelettingFeeCalculator />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}