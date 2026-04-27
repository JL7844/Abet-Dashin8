-- Abet-Dashen Bank Attendance Management System
-- Database Schema

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  position TEXT,
  hire_date DATE,
  face_data JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance sessions table (for admin to start/stop attendance periods)
CREATE TABLE IF NOT EXISTS attendance_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_by UUID,
  is_active BOOLEAN DEFAULT true,
  notes TEXT
);

-- Attendance records table
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  session_id UUID REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  check_in_time TIMESTAMPTZ DEFAULT NOW(),
  check_out_time TIMESTAMPTZ,
  status TEXT CHECK (status IN ('verified', 'pending', 'suspicious', 'absent')) DEFAULT 'pending',
  verification_method TEXT CHECK (verification_method IN ('face_scan', 'manual', 'admin_override')) DEFAULT 'face_scan',
  face_scan_confidence DECIMAL(5,2),
  location TEXT,
  device_info JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Illness reports table
CREATE TABLE IF NOT EXISTS illness_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  illness_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  symptoms TEXT,
  has_medical_certificate BOOLEAN DEFAULT false,
  certificate_url TEXT,
  additional_notes TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  reference_number TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  status TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_active ON employees(is_active);
CREATE INDEX IF NOT EXISTS idx_attendance_records_employee ON attendance_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_session ON attendance_records(session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_date ON attendance_records(check_in_time);
CREATE INDEX IF NOT EXISTS idx_illness_reports_employee ON illness_reports(employee_id);
CREATE INDEX IF NOT EXISTS idx_illness_reports_dates ON illness_reports(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_activity_logs_employee ON activity_logs(employee_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_date ON activity_logs(created_at);

-- Enable Row Level Security
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE illness_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust based on your auth requirements)
CREATE POLICY "Allow public read access to departments" ON departments FOR SELECT USING (true);
CREATE POLICY "Allow public read access to employees" ON employees FOR SELECT USING (true);
CREATE POLICY "Allow public read access to attendance_sessions" ON attendance_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public read access to attendance_records" ON attendance_records FOR SELECT USING (true);
CREATE POLICY "Allow public read access to illness_reports" ON illness_reports FOR SELECT USING (true);
CREATE POLICY "Allow public read access to activity_logs" ON activity_logs FOR SELECT USING (true);

-- Create policies for insert/update/delete (allow all for now, tighten based on auth)
CREATE POLICY "Allow public insert to employees" ON employees FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to employees" ON employees FOR UPDATE USING (true);
CREATE POLICY "Allow public insert to attendance_sessions" ON attendance_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to attendance_sessions" ON attendance_sessions FOR UPDATE USING (true);
CREATE POLICY "Allow public insert to attendance_records" ON attendance_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to attendance_records" ON attendance_records FOR UPDATE USING (true);
CREATE POLICY "Allow public insert to illness_reports" ON illness_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to illness_reports" ON illness_reports FOR UPDATE USING (true);
CREATE POLICY "Allow public insert to activity_logs" ON activity_logs FOR INSERT WITH CHECK (true);
