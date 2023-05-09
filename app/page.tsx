'use client'

import { DatePicker, Select } from "antd";

export default function Home() {
  const { RangePicker } = DatePicker;
  return (
    <div className="flex justify-center gap-8 my-48">
      <div>
        <Select placeholder="Leaving from" />
      </div>
      <div>
        <Select placeholder="Going to" />
      </div>
      <div>
        <RangePicker />
      </div>
    </div>
  )
}
