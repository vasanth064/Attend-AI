import { useGenerateReportMutation } from "@/redux/users/userApiSlice";
import { z } from "zod"
import { ReportResponseObject } from "@/redux/users/userApiSlice"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { useState } from "react";

import { cn } from "@/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast"
import { SerializedError } from "@reduxjs/toolkit";
import { Skeleton } from "./ui/skeleton";

const customDateFormat = (date: Date) => {
  return (new Date(date)).toLocaleDateString() +
    " " +
    (new Date(date)).toLocaleTimeString()
}

const getAttendanceStatus = (data: ReportResponseObject) => {
  if (data.AttendanceLogs.length === 0) {
    if (data.session.endDateTime < new Date())
      return <Badge className="bg-red-500">Absent</Badge>
    else
      return <Badge className="bg-grey-500">Upcoming</Badge>
  }
  return <Badge className="bg-green-500">Present</Badge>
}

const FormSchema = z.object({
  startTime: z.date({
    required_error: "A Start time is required",
  }),
  endTime: z.date({
    required_error: "A End time is required",
  })
})

const ReportForm = ({ cb }: { cb: (data: { startTime: Date, endTime: Date }) => void }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(cb)} className="space-y-8">
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Time</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Time</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Search</Button>
      </form>
    </Form>
  )
}

const UserReportTable = ({ data, isLoading }: { data: ReportResponseObject[], isLoading: boolean }) => {
  return (
    <>
      {
        data.length === 0 ?
          <div className="w-full h-full bg-slate-100 rounded-md grid place-items-center text-muted-foreground">Currently, there are no logs. Try applying any filters</div>
          :
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Session Name</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead className="text-right">Attendance Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((d, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{isLoading ? <Skeleton className="h-[30px]" /> : d.session.name}</TableCell>
                  <TableCell>{isLoading ? <Skeleton className="h-[30px]" /> : customDateFormat(d.session.startDateTime)}</TableCell>
                  <TableCell>{isLoading ? <Skeleton className="h-[30px]" /> : customDateFormat(d.session.endDateTime)}</TableCell>
                  <TableCell className="text-right">{isLoading ? <Skeleton className="h-[30px]" /> : getAttendanceStatus(d)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      }
    </>
  )
}

const UserAttendanceReport = () => {
  const [generateReport, { isLoading }] = useGenerateReportMutation();
  const [data, setData] = useState<ReportResponseObject[]>([]);
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
    const res = await generateReport({ startTime: data.startTime, endTime: data.endTime });
    if (res.error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: (res.error as SerializedError).message
      })
      return;
    }
    if (res.data)
      setData(res.data);

    console.log(res.data);
  }
  return (
    <>
      <section className="flex gap-10 w-full h-full">
        <ReportForm cb={onSubmit} />
        <aside className="flex flex-col gap-4 w-full min-h-[500px]">
          <h2>{data.length !== 0 ? "Report" : ""}</h2>
          <UserReportTable data={data} isLoading={isLoading} />
        </aside>
      </section>
    </>
  )
}


export default UserAttendanceReport;
