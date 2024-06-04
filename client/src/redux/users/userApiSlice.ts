import { apiSlice } from './../api/apiSlice';


export interface Session {
  id: number;
  name: string;
  startDateTime: Date;
  endDateTime: Date;
  clientID: number;
}

interface ReportRequest {
  startTime: Date;
  endTime: Date;
}


export interface ReportResponseObject {
  session: Session;
  AttendanceLogs: {
    id: number;
    enrollmentId: number;
    attendanceMarkedAt: Date;
  }[];
}

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserSessions: builder.query<Session[], void>({
      query: () => "/users/sessions",
      transformResponse: (response: { Enrollments: { session: Session }[] }, _meta, _arg) => {
        let resultData: Session[] = [];
        response.Enrollments.forEach((e) => {
          resultData.push(e.session);
        });
        return resultData;
      }
    }),
    generateReport: builder.mutation<ReportResponseObject[], ReportRequest>({
      query: ({ startTime, endTime }) => ({
        url: "/users/sessions/logs",
        method: "POST",
        body: {
          startTime,
          endTime
        },
      }),
    })
  })
})

export const { useGetUserSessionsQuery, useGenerateReportMutation } = userApiSlice;
