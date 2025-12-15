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
import { useCallback, useEffect, useState } from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { getDeviceData, getDevicesNames } from '@/lib/devices';

export const description = "View detailed charts of your plant's water and moisture levels over time to help you keep them healthy and thriving.";

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
    const [deviceList, setDeviceList] = useState<{id: number, name: string}[]>([]);
    const [selectedDevice, setSelectedDevice] = useState("");
    const [selectedTime, setSelectedTime] = useState("day");
    const [chartRange, setChartRange] = useState(new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }));
    const [currentChartData, setCurrentChartData] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    const updateChartRange = (date: Date, rangeType: string) => {
        switch (rangeType) {
            case "day": {
                const formatted = date.toLocaleDateString(
                    "en-US", 
                    { 
                        month: "long",
                        weekday: "long",
                        day: "numeric",
                        year: "numeric"
                    });
                setChartRange(formatted);
                break;
            }
            case "week": {
                const tempDate = new Date(date);
                const first = tempDate.getDate() - tempDate.getDay() + 1;
                const last = first + 6;
                const firstday = new Date(tempDate.setDate(first)).toLocaleDateString("en-US", { month: "long", day: "numeric" });
                const lastday = new Date(tempDate.setDate(last)).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
                setChartRange(`${firstday} - ${lastday}`);
                break;
            }
            case "month": { 
                const month = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
                setChartRange(`${month}`);
                break;
            }
            case "year": {
                const year = date.getFullYear();
                setChartRange(`${year}`);
                break;
            }
            default:
                setChartRange("January - June 2024");
                break;
        }
    }

    const handleChangeTime = (value: string) => {
        setSelectedTime(value);
        const now = new Date();
        setCurrentDate(now);
        updateChartRange(now, value);
        // Fetch new data with the updated time range
        if (selectedDevice) {
            handleGetDeviceData(selectedDevice, value, now);
        }
    }

    const handleNavigateTime = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        
        switch (selectedTime) {
            case "day":
                newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
                break;
            case "week":
                newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
                break;
            case "month":
                newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
                break;
            case "year":
                newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
                break;
        }
        
        setCurrentDate(newDate);
        updateChartRange(newDate, selectedTime);
        
        if (selectedDevice) {
            handleGetDeviceData(selectedDevice, selectedTime, newDate);
        }
    }

    const handleDeviceChange = (value: string) => {
        console.log("Selected device:", value);
        setSelectedDevice(value);
        // Fetch data for the newly selected device
        handleGetDeviceData(value, selectedTime, currentDate);
    }

    const handleGetDeviceData = async (deviceId: string, rangeType: string, endDate: Date = new Date()) => {
        const now = new Date(endDate);
        const startDate = new Date(endDate);
        
        // Calculate start date based on range type
        switch (rangeType) {
            case "day":
                startDate.setDate(startDate.getDate() - 1);
                break;
            case "week":
                startDate.setDate(startDate.getDate() - 7);
                break;
            case "month":
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            case "year":
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            default:
                startDate.setDate(startDate.getDate() - 1);
        }
        
        const data = await getDeviceData(deviceId, startDate.toISOString(), now.toISOString(), rangeType);
        setCurrentChartData(data.data);
    }

    const handleGetDevicesNames = useCallback(async () => {
        const data = await getDevicesNames();
        setDeviceList(data.devices);
        if (data.devices.length > 0) {
            const firstDevice = data.devices[0].name;
            setSelectedDevice(firstDevice);
            // Fetch initial data for the first device
            handleGetDeviceData(firstDevice, "day");
        }
    }, []);

    useEffect(() => {
        handleGetDevicesNames();
    }, [handleGetDevicesNames]);


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
                                <button 
                                    onClick={() => handleNavigateTime('prev')}
                                    className='hover:bg-[var(--kitty-white)] p-1 rounded-lg transition-colors flex items-center justify-center duration-400'
                                >
                                    <ArrowBackIosIcon className='text-sm ml-2.5'  />
                                </button>
                                {chartRange}
                                <button 
                                    onClick={() => handleNavigateTime('next')}
                                    className='hover:bg-[var(--kitty-white)] p-1 rounded-lg transition-colors flex items-center justify-center duration-400'
                                >
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