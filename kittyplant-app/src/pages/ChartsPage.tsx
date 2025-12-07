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
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export const description = "View detailed charts of your plant's water and moisture levels over time to help you keep them healthy and thriving.";

const chartDataDay = [
    { time: "00:00", moisture: 45, water: 60 },
    { time: "01:00", moisture: 44, water: 59 },
    { time: "02:00", moisture: 43, water: 58 },
    { time: "03:00", moisture: 42, water: 58 },
    { time: "04:00", moisture: 42, water: 58 },
    { time: "05:00", moisture: 43, water: 59 },
    { time: "06:00", moisture: 45, water: 61 },
    { time: "07:00", moisture: 47, water: 63 },
    { time: "08:00", moisture: 48, water: 65 },
    { time: "09:00", moisture: 49, water: 66 },
    { time: "10:00", moisture: 50, water: 68 },
    { time: "11:00", moisture: 51, water: 69 },
    { time: "12:00", moisture: 52, water: 70 },
    { time: "13:00", moisture: 52, water: 70 },
    { time: "14:00", moisture: 51, water: 69 },
    { time: "15:00", moisture: 50, water: 68 },
    { time: "16:00", moisture: 50, water: 68 },
    { time: "17:00", moisture: 49, water: 66 },
    { time: "18:00", moisture: 48, water: 65 },
    { time: "19:00", moisture: 47, water: 63 },
    { time: "20:00", moisture: 46, water: 62 },
    { time: "21:00", moisture: 46, water: 62 },
    { time: "22:00", moisture: 45, water: 61 },
    { time: "23:00", moisture: 45, water: 60 },
]

const chartDataWeek = [
  { time: "Mon", moisture: 45, water: 60 },
  { time: "Tue", moisture: 48, water: 65 },
  { time: "Wed", moisture: 42, water: 55 },
  { time: "Thu", moisture: 50, water: 68 },
  { time: "Fri", moisture: 47, water: 63 },
  { time: "Sat", moisture: 52, water: 72 },
  { time: "Sun", moisture: 49, water: 67 },
]

const chartDataMonth = [
  { time: "Week 1", moisture: 30, water: 80 },
  { time: "Week 2", moisture: 40, water: 70 },
  { time: "Week 3", moisture: 37, water: 65 },
  { time: "Week 4", moisture: 45, water: 75 },
]

const chartDataYear = [
  { time: "Jan", moisture: 30, water: 80 },
  { time: "Feb", moisture: 40, water: 70 },
  { time: "Mar", moisture: 37, water: 65 },
  { time: "Apr", moisture: 73, water: 90 },
  { time: "May", moisture: 50, water: 75 },
  { time: "Jun", moisture: 44, water: 68 },
  { time: "Jul", moisture: 38, water: 62 },
  { time: "Aug", moisture: 42, water: 70 },
  { time: "Sep", moisture: 48, water: 78 },
  { time: "Oct", moisture: 52, water: 82 },
  { time: "Nov", moisture: 46, water: 74 },
  { time: "Dec", moisture: 40, water: 68 },
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



function ChartsPage() {
    const [selectedDevice, setSelectedDevice] = useState(deviceList[0].name);
    const [selectedTime, setSelectedTime] = useState("day");
    const [chartRange, setChartRange] = useState(new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }));
    const [currentChartData, setCurrentChartData] = useState(chartDataDay);

    const handleChangeTime = (value: string) => {
        setSelectedTime(value);
        switch (value) {
            case "day": {
                const now = new Date().toLocaleDateString(
                    "en-US", 
                    { 
                        month: "long",
                        weekday: "long",
                        day: "numeric",
                        year: "numeric"
                    });
                setChartRange(now);
                setCurrentChartData(chartDataDay);
                break;
            }
            case "week":{
                const now = new Date();
                const first = now.getDate() - now.getDay() + 1;
                const last = first + 6;
                const firstday = new Date(now.setDate(first)).toLocaleDateString("en-US", { month: "long", day: "numeric" });
                const lastday = new Date(now.setDate(last)).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
                setChartRange(`${firstday} - ${lastday}`);
                setCurrentChartData(chartDataWeek);
                break;
            }
            case "month": { 
                const now = new Date();
                const month = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
                setChartRange(`${month}`);
                setCurrentChartData(chartDataMonth);
                break;
            }
            case "year": {
                const now = new Date();
                const year = now.getFullYear();
                setChartRange(`${year}`);
                setCurrentChartData(chartDataYear);
                break;
            }
            default:
                setChartRange("January - June 2024");
                break;
        }
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
                            data={currentChartData}
                            margin={{
                            left: 12,
                            right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                            dataKey="time"
                            tickLine={false}
                            axisLine={false}
                            interval="preserveStartEnd"
                            textAnchor="middle"
                            tickMargin={10}
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
                        <div className="flex w-full  text-sm flex-col">
                            <div className='flex gap-2 items-center justify-center mb-2 text-muted-foreground'>
                                <button className='hover:bg-[var(--kitty-white)] p-1 rounded-lg transition-colors flex items-center justify-center duration-400'>
                                    <ArrowBackIosIcon className='text-sm ml-2.5'  />
                                </button>
                                {chartRange}
                                <button className='hover:bg-[var(--kitty-white)] p-1 rounded-lg transition-colors flex items-center justify-center duration-400'>
                                    <ArrowBackIosIcon className='rotate-180 mr-2.5'/>
                                </button>
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

export default ChartsPage;