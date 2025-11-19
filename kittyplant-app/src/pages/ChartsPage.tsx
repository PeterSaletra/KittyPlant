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
import { useState } from 'react'


export const description = "View detailed charts of your plant's water and moisture levels over time to help you keep them healthy and thriving.";

const chartData = [
  { month: "January", moisture: 30, water: 80 },
  { month: "February", moisture: 40, water: 20 },
  { month: "March", moisture: 37, water: 20 },
  { month: "April", moisture: 73, water: 90 },
  { month: "May", moisture: 50, water: 30 },
  { month: "June", moisture: 14, water: 40 },
]

const deviceList = [
    { id: 1, name: "Custom Device Name 1" },
    { id: 2, name: "Custom Device Name 2" },
    { id: 3, name: "Custom Device Name 3" },
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
    const [selectedDevice, setSelectedDevice] = useState(deviceList[0].name);
    const [selectedTime, setSelectedTime] = useState("day");

    const handleChangeTime = (value: string) => {
        setSelectedTime(value);
    }

    const handleDeviceChange = (value: string) => {
        console.log("Selected device:", value);
        setSelectedDevice(value);
        // You can add logic here to update the chart data based on the selected device
    }

    return (
        <div>
            <Header />
            
            <div>
                <Card className="max-w-3xl mx-auto mt-5">
                    <CardHeader>
                        <CardTitle className='flex justify-between items-center gap-2'>
                            <div>
                            Water and Moisture Levels
                            </div>
                            <div className='flex gap-4'>
                                <Select value={selectedTime} onValueChange={(e) => handleChangeTime(e)}>
                                    <SelectTrigger className="bg-(--kitty-white)">
                                        <SelectValue placeholder="Select time period" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-(--kitty-light-pink) border-2 border-(--kitty-white)'  >
                                        <SelectItem key="day" value="day">Day</SelectItem>
                                        <SelectItem key="week" value="week">Week</SelectItem>
                                        <SelectItem key="month" value="month">Month</SelectItem>
                                        <SelectItem key="year" value="year">Year</SelectItem>                                    
                                    </SelectContent>
                                </Select>
                                <Select value={selectedDevice} onValueChange={(e) => handleDeviceChange(e)}>
                                    <SelectTrigger className="bg-(--kitty-white)">
                                        <SelectValue placeholder="Select a device" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-(--kitty-light-pink) border-2 border-(--kitty-white)'  >
                                        {deviceList.map((device) => (
                                            <SelectItem key={device.id} value={device.name}>{device.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardTitle>
                        <CardDescription>
                        Showing moisture and water levels for {selectedDevice} over the last {selectedTime}
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
            <img src={leaftoplfet} alt="Leaf Top Left" className="fixed -z-5 h-auto w-1/5 top-0 left-0"/>
            <img src={leaftopright} alt="Leaf Top Right" className="fixed -z-5 h-auto w-1/5 top-0 right-0"/>
        </div>
    );
}

export default ProfilePage;