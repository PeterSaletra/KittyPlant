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
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--kitty-dark-pink)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--kitty-crayola)",
  },
} satisfies ChartConfig


function ProfilePage() {
    return (
        <div>
            <Header />
            
            <div>
                <Card className="max-w-3xl mx-auto mt-5">
                    <CardHeader>
                        <CardTitle className='flex justify-between items-center gap-2'>
                            Area Chart - Gradient
                            <Select>
                                <SelectTrigger className="bg-(--kitty-white)">
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
                            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                offset="5%"
                                stopColor="var(--color-desktop)"
                                stopOpacity={0.8}
                                />
                                <stop
                                offset="95%"
                                stopColor="var(--color-desktop)"
                                stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                offset="5%"
                                stopColor="var(--color-mobile)"
                                stopOpacity={0.8}
                                />
                                <stop
                                offset="95%"
                                stopColor="var(--color-mobile)"
                                stopOpacity={0.1}
                                />
                            </linearGradient>
                            </defs>
                            <Area
                            dataKey="mobile"
                            type="natural"
                            fill="url(#fillMobile)"
                            fillOpacity={0.4}
                            stroke="var(--color-mobile)"
                            stackId="a"
                            />
                            <Area
                            dataKey="desktop"
                            type="natural"
                            fill="url(#fillDesktop)"
                            fillOpacity={0.4}
                            stroke="var(--color-desktop)"
                            stackId="a"
                            />
                        </AreaChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter>
                        <div className="flex w-full items-start gap-2 text-sm">
                        <div className="grid gap-2">
                            <div className="flex items-center gap-2 leading-none font-medium">
                            Trending up by 5.2% this month
                            </div>
                            <div className="text-muted-foreground flex items-center gap-2 leading-none">
                            January - June 2024
                            </div>
                        </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>

            <MenuButton />
            <img src={leaftoplfet} alt="Leaf Top Left" className="fixed -z-5 h-auto w-1/5 top-0 left-0"/>
            <img src={leaftopright} alt="Leaf Top Right" className="fixed -z-5 h-auto w-1/5 top-0 right-0"/>
        </div>
    );
}

export default ProfilePage;