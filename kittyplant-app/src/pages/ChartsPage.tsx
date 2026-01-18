import Header from '../components/Header'
import leaftoplfet from '../assets/leaftopleft.png'
import leaftopright from '../assets/leaftopright.png'
import MenuButton from '../components/MenuButton'
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export const description = "An area chart with gradient fill"

const chartData = [
  { month: "January", moisture: 30, water: 80 },
  { month: "February", moisture: 40, water: 20 },
  { month: "March", moisture: 37, water: 20 },
  { month: "April", moisture: 73, water: 90 },
  { month: "May", moisture: 50, water: 30 },
  { month: "June", moisture: 14, water: 40 },
]
const chartConfig = {
  moisture: {
    label: "Moisture",
    color: "var(--kitty-dark-pink)",
  },
  water: {
    label: "Water",
    color: "var(--kitty-crayola)",
  },
} satisfies ChartConfig


function ProfilePage() {
    return (
        <div className="min-h-screen">
            <Header />
            
            <div className='px-4'>
                <Card className="max-w-3xl mx-auto mt-5">
                    <CardHeader>
                        <CardTitle className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2'>
                            <span className='text-lg sm:text-xl'>Water and Moisture Levels</span>
                            <Select>
                                <SelectTrigger className="bg-(--kitty-white) w-full sm:w-[200px]">
                                    <SelectValue placeholder="Select a plant" />
                                </SelectTrigger>
                                <SelectContent className='bg-(--kitty-light-pink) border-2 border-(--kitty-white)'>
                                    <SelectItem value="light">Custom Device Name 1</SelectItem>
                                    <SelectItem value="dark">Custom Device Name 2</SelectItem>
                                    <SelectItem value="system">Custom Device Name 3</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardTitle>
                        <CardDescription>
                        Showing total visitors for the last 6 months
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                            left: 12,
                            right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent className='bg-(--kitty-white)'/>} />
                            <defs>
                            <linearGradient id="fillMoisture" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                offset="5%"
                                stopColor="var(--color-moisture)"
                                stopOpacity={0.8}
                                />
                                <stop
                                offset="95%"
                                stopColor="var(--color-moisture)"
                                stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillWater" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                offset="5%"
                                stopColor="var(--color-water)"
                                stopOpacity={0.8}
                                />
                                <stop
                                offset="95%"
                                stopColor="var(--color-water)"
                                stopOpacity={0.1}
                                />
                            </linearGradient>
                            </defs>
                            <Area
                            dataKey="water"
                            type="natural"
                            fill="url(#fillWater)"
                            fillOpacity={0.4}
                            stroke="var(--color-water)"
                            stackId="a"
                            />
                            <Area
                            dataKey="moisture"
                            type="natural"
                            fill="url(#fillMoisture)"
                            fillOpacity={0.4}
                            stroke="var(--color-moisture)"
                            stackId="a"
                            />
                        </AreaChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter>
                        <div className="flex w-full items-start gap-2 text-sm">
                        <div className="grid gap-2">
                            <div className="text-muted-foreground flex items-center gap-2 leading-none">
                            January - June 2024
                            </div>
                        </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>

            <MenuButton />
            <img src={leaftoplfet} alt="Leaf Top Left" className="hidden sm:block fixed -z-5 h-auto w-1/5 top-0 left-0"/>
            <img src={leaftopright} alt="Leaf Top Right" className="hidden sm:block fixed -z-5 h-auto w-1/5 top-0 right-0"/>
        </div>
    );
}

export default ProfilePage;