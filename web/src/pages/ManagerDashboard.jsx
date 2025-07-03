import { useEffect, useState } from 'react';
import { Alert } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '../components/useAuth';
import DoughnutChart from '../components/DoughnutChart';

export default function ManagerDashboard({ token }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ engineerId: '', projectId: '', allocationPercentage: 100, startDate: '', endDate: '', role: '' });
  const [submitting, setSubmitting] = useState(false);
  const [refresh, setRefresh] = useState(false);
  // --- Search & Analytics State ---
  const [engineerSkillFilter, setEngineerSkillFilter] = useState('');
  const [projectStatusFilter, setProjectStatusFilter] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.VITE_BASE_API}/api/projects`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch(`${import.meta.env.VITE_BASE_API}/api/engineers`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch(`${import.meta.env.VITE_BASE_API}/api/assignments`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
    ]).then(([projects, engineers, assignments]) => {
      setProjects(projects);
      setEngineers(engineers);
      setAssignments(assignments);
      setLoading(false);
    }).catch(() => {
      setError('Failed to load data');
      setLoading(false);
    });
  }, [token, refresh]);

  const handleAssign = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch(`${import.meta.env.VITE_BASE_API}/api/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      setForm({ engineerId: '', projectId: '', allocationPercentage: 100, startDate: '', endDate: '', role: '' });
      setRefresh(r => !r);
    } catch {
      alert('Failed to assign engineer');
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <Skeleton className="h-8 w-1/3 mb-4" />
      <Skeleton className="h-6 w-1/2 mb-2" />
      <Skeleton className="h-96 w-full max-w-4xl mb-4" />
      <Skeleton className="h-10 w-1/4" />
    </div>
  );
  if (error) return (
    <div className="mb-4">
      <Alert variant="destructive">{error}</Alert>
    </div>
  );

  // Helper: calculate engineer's total allocation
  const getEngineerAllocation = (engineerId) => {
    return assignments.filter(a => a.engineerId?._id === engineerId).reduce((sum, a) => sum + (a.allocationPercentage || 0), 0);
  };

  // --- Filtered Data ---
  const filteredEngineers = engineerSkillFilter
    ? engineers.filter(e => e.skills && e.skills.some(skill => skill.toLowerCase().includes(engineerSkillFilter.toLowerCase())))
    : engineers;

  const filteredProjects = projectStatusFilter
    ? projects.filter(p => p.status && p.status.toLowerCase() === projectStatusFilter.toLowerCase())
    : projects;

  // --- Analytics: Team Utilization ---
  const totalCapacity = engineers.reduce((sum, e) => sum + (e.maxCapacity || 0), 0);
  const totalAllocated = engineers.reduce((sum, e) => sum + getEngineerAllocation(e._id), 0);

  // Helper: get next available date for an engineer
  const getEngineerNextAvailable = (engineerId) => {
    const now = new Date();
    const futureAssignments = assignments
      .filter(a => a.engineerId?._id === engineerId && new Date(a.endDate) > now)
      .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
    if (futureAssignments.length === 0) return 'Now';
    return futureAssignments[futureAssignments.length - 1].endDate?.slice(0, 10);
  };

  // --- Doughnut Chart Data Preparation ---
  // 1. Team Utilization (Allocated vs Available)
  const utilizationData = [
    { name: 'Allocated', value: totalAllocated },
    { name: 'Available', value: totalCapacity - totalAllocated }
  ];
  // 2. Project Status Distribution
  const statusCounts = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});
  const projectStatusData = Object.entries(statusCounts).map(([status, count]) => ({ name: status, value: count }));
  // 3. Engineer Skill Distribution (top 5 skills)
  const skillCounts = {};
  engineers.forEach(e => (e.skills || []).forEach(skill => {
    skillCounts[skill] = (skillCounts[skill] || 0) + 1;
  }));
  const skillData = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill, count]) => ({ name: skill, value: count }));

  // Color palettes
  const COLORS1 = ['#0088FE', '#00C49F'];
  const COLORS2 = ['#FFBB28', '#FF8042', '#0088FE', '#00C49F', '#FF6384'];
  const COLORS3 = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

  return (
    <div className=" min-h-screen">
      {/* Search & Analytics Section */}
      <Card className="mb-6">
        <CardContent>
          <section>
            <h3 className="text-lg font-semibold mt-6 mb-2">Search & Analytics</h3>
            {/* Filter Controls (as before) */}
            <div className="mb-4 flex flex-wrap gap-4 items-end items-start">
              <div>
                <Label htmlFor="engineer-skill-filter" className="block text-sm mb-1">Filter Engineers by Skill:</Label>
                <Input
                  id="engineer-skill-filter"
                  type="text"
                  placeholder="e.g. React"
                  value={engineerSkillFilter}
                  onChange={e => setEngineerSkillFilter(e.target.value)}
                />
                {/* Search Results Section for Engineers */}
                {engineerSkillFilter && (
                  <div className="mt-2 bg-blue-50 border border-blue-200 rounded p-2">
                    <div className="font-semibold mb-1 text-blue-700">Matching Engineers:</div>
                    {filteredEngineers.length === 0 ? (
                      <div className="text-gray-500">No engineers found.</div>
                    ) : (
                      <ul className="space-y-2">
                        {filteredEngineers.map(engineer => (
                          <li key={engineer._id} className="p-2 border rounded bg-gray-50">
                            <div className="font-semibold">{engineer.name} ({engineer.email})</div>
                            <div>Skills: {engineer.skills?.join(', ')}</div>
                            <div>Seniority: {engineer.seniority}</div>
                            <div>Employment: {engineer.maxCapacity === 100 ? 'Full-time' : 'Part-time'}</div>
                            <div>
                              {(() => {
                                const allocation = getEngineerAllocation(engineer._id);
                                const percent = engineer.maxCapacity ? Math.round((allocation / engineer.maxCapacity) * 100) : 0;
                                return (
                                  <>
                                    Status: {Math.min(100, percent)}% allocated, {Math.max(0, 100 - percent)}% available
                                  </>
                                );
                              })()}
                            </div>
                            <div className="w-full bg-gray-200 rounded h-2 mt-1">
                              {(() => {
                                const allocation = getEngineerAllocation(engineer._id);
                                const percent = engineer.maxCapacity ? Math.round((allocation / engineer.maxCapacity) * 100) : 0;
                                return (
                                  <div className="bg-blue-500 h-2 rounded" style={{ width: `${Math.min(100, percent)}%` }}></div>
                                );
                              })()}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="project-status-filter" className="block text-sm mb-1">Filter Projects by Status:</Label>
                <Select value={projectStatusFilter} onValueChange={setProjectStatusFilter}>
                  <SelectTrigger id="project-status-filter" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                {/* Search Results Section for Projects */}
                {projectStatusFilter && (
                  <div className="mt-2 bg-green-50 border border-green-200 rounded p-2">
                    <div className="font-semibold mb-1 text-green-700">Matching Projects:</div>
                    {filteredProjects.length === 0 ? (
                      <div className="text-gray-500">No projects found.</div>
                    ) : (
                      <ul className="space-y-2">
                        {filteredProjects.map(project => (
                          <li key={project._id} className="p-2 border rounded bg-gray-50">
                            <div className="font-semibold">{project.name}</div>
                            <div>{project.description}</div>
                            <div>Start: {project.startDate?.slice(0, 10)} | End: {project.endDate?.slice(0, 10)}</div>
                            <div>Team Size: {project.teamSize}</div>
                            <div>Required Skills: {project.requiredSkills?.join(', ')}</div>
                            <div>Status: {project.status}</div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Search Results Section */}
            {(engineerSkillFilter || projectStatusFilter) && (
              <div className="mb-8 p-4 border rounded bg-gray-50">
                <h4 className="font-semibold mb-2">Search Results</h4>
                {/* Engineers */}
                {engineerSkillFilter && (
                  <div className="mb-4">
                    <h5 className="font-semibold">Matching Engineers</h5>
                    <ul>
                      {engineers.filter(e => e.skills && e.skills.some(skill => skill.toLowerCase().includes(engineerSkillFilter.toLowerCase()))).map(engineer => (
                        <li key={engineer._id} className="mb-2 p-2 border rounded bg-gray-50">
                          <div className="font-semibold">{engineer.name} ({engineer.email})</div>
                          <div>Skills: {engineer.skills?.join(', ')}</div>
                          <div>Seniority: {engineer.seniority}</div>
                          <div>Employment: {engineer.maxCapacity === 100 ? 'Full-time' : 'Part-time'}</div>
                        </li>
                      ))}
                      {engineers.filter(e => e.skills && e.skills.some(skill => skill.toLowerCase().includes(engineerSkillFilter.toLowerCase()))).length === 0 && (
                        <li className="text-gray-500">No matching engineers found.</li>
                      )}
                    </ul>
                  </div>
                )}
                {/* Projects */}
                {projectStatusFilter && (
                  <div className="mb-4">
                    <h5 className="font-semibold">Matching Projects</h5>
                    <ul>
                      {projects.filter(p => p.status && p.status.toLowerCase() === projectStatusFilter.toLowerCase()).map(project => (
                        <li key={project._id} className="mb-2 p-2 border rounded bg-gray-50">
                          <div className="font-semibold">{project.name}</div>
                          <div>{project.description}</div>
                          <div>Status: {project.status}</div>
                        </li>
                      ))}
                      {projects.filter(p => p.status && p.status.toLowerCase() === projectStatusFilter.toLowerCase()).length === 0 && (
                        <li className="text-gray-500">No matching projects found.</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Doughnut Charts */}
            <div className="flex flex-row gap-8 items-start justify-start overflow-x-auto h-[400px]" style={{ minWidth: '900px' }}>
              <DoughnutChart
                data={utilizationData}
                dataKey="value"
                nameKey="name"
                colors={COLORS1}
                title="Team Utilization"
              />
              <DoughnutChart
                data={projectStatusData}
                dataKey="value"
                nameKey="name"
                colors={COLORS2}
                title="Project Status Distribution"
              />
              <DoughnutChart
                data={skillData}
                dataKey="value"
                nameKey="name"
                colors={COLORS3}
                title="Top 5 Engineer Skills"
              />
            </div>
          </section>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mb-4 px-4 pt-4">Manager Dashboard</h2>

      {/* Engineer List */}
      <h3 className="text-lg font-semibold mt-6 mb-2 px-4">Engineers</h3>
      <Card className="mb-6">
        <CardContent >
          <ul className="mb-6">
            {filteredEngineers.map(engineer => (
              <li key={engineer._id} className="mb-2 p-2 border rounded bg-gray-50">
                <div className="font-semibold">{engineer.name} ({engineer.email})</div>
                <div>Skills: {engineer.skills?.join(', ')}</div>
                <div>Seniority: {engineer.seniority}</div>
                <div>Employment: {engineer.maxCapacity === 100 ? 'Full-time' : 'Part-time'}</div>
                <div>
                  {/* Show allocation as a percentage of maxCapacity, capped at 100% */}
                  {(() => {
                    const allocation = getEngineerAllocation(engineer._id);
                    const percent = engineer.maxCapacity ? Math.round((allocation / engineer.maxCapacity) * 100) : 0;
                    return (
                      <>
                        Status: {Math.min(100, percent)}% allocated, {Math.max(0, 100 - percent)}% available
                      </>
                    );
                  })()}
                </div>
                <div className="w-full bg-gray-200 rounded h-2 mt-1">
                  {(() => {
                    const allocation = getEngineerAllocation(engineer._id);
                    const percent = engineer.maxCapacity ? Math.round((allocation / engineer.maxCapacity) * 100) : 0;
                    return (
                      <div className="bg-blue-500 h-2 rounded" style={{ width: `${Math.min(100, percent)}%` }}></div>
                    );
                  })()}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Engineer Availability Section */}
      <h3 className="text-lg font-semibold mt-6 mb-2 px-4">Engineer Availability</h3>
      <Card className="mb-6">
        <CardContent >
          <ul className="mb-6">
            {engineers.map(engineer => (
              <li key={engineer._id} className="mb-2 p-2 border rounded flex items-center justify-between bg-gray-50">
                <span>{engineer.name} ({engineer.email})</span>
                <span className="text-green-700 font-semibold">Next available: {getEngineerNextAvailable(engineer._id)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Project List */}
      <h3 className="text-lg font-semibold mt-6 mb-2 px-4">Projects</h3>
      <Card className="mb-6">
        <CardContent >
          <ul className="mb-6">
            {filteredProjects.map(project => (
              <li key={project._id} className="mb-2 p-2 border rounded bg-gray-50">
                <div className="font-semibold">{project.name}</div>
                <div>{project.description}</div>
                <div>Start: {project.startDate?.slice(0, 10)} | End: {project.endDate?.slice(0, 10)}</div>
                <div>Team Size: {project.teamSize}</div>
                <div>Required Skills: {project.requiredSkills?.join(', ')}</div>
                <div>Status: {project.status}</div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Assignment Form (only for managers) */}
      {user?.role === 'manager' && (
        <>
          <h3 className="text-lg font-semibold mt-6 mb-2">Assign Engineer to Project</h3>
          <form onSubmit={handleAssign} className="mb-8 p-4 border rounded bg-gray-50">
            <div className="mb-2">
              <Label htmlFor="assign-engineer" className="block mb-2">Engineer:</Label>
              <Select value={form.engineerId} onValueChange={v => setForm(f => ({ ...f, engineerId: v }))} required>
                <SelectTrigger id="assign-engineer" className="w-full">
                  <SelectValue placeholder="Select engineer" />
                </SelectTrigger>
                <SelectContent>
                  {engineers.map(e => <SelectItem key={e._id} value={e._id}>{e.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-2">
              <Label htmlFor="assign-project" className="block mb-2">Project:</Label>
              <Select value={form.projectId} onValueChange={v => setForm(f => ({ ...f, projectId: v }))} required>
                <SelectTrigger id="assign-project" className="w-full">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(p => <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-2">
              <Label htmlFor="allocation" className="block mb-2">Allocation %:</Label>
              <Input id="allocation" type="number" min="1" max="100" value={form.allocationPercentage} onChange={e => setForm(f => ({ ...f, allocationPercentage: Number(e.target.value) }))} required />
            </div>
            <div className="mb-2 flex flex-col gap-4">
              <div>
                <Label htmlFor="start-date" className="block mb-2">Start Date:</Label>
                <input
                  id="start-date"
                  type="date"
                  className="rounded-md border px-2 py-1"
                  value={form.startDate}
                  onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="end-date" className="block mb-2">End Date:</Label>
                <input
                  id="end-date"
                  type="date"
                  className="rounded-md border px-2 py-1"
                  value={form.endDate}
                  onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="mb-2">
              <Label htmlFor="role" className="block mb-2">Role:</Label>
              <Input id="role" type="text" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} required />
            </div>
            <Button type="submit" className="w-full mt-2" disabled={submitting}>
              {submitting ? 'Assigning...' : 'Assign'}
            </Button>
          </form>
        </>
      )}

      {/* Assignment List */}
      <h3 className="text-lg font-semibold mt-6 mb-2 px-4">Current Assignments</h3>
      <ul>
        {assignments.map(a => (
          <li key={a._id} className="mb-2 p-2 border rounded bg-gray-50">
            <div>Engineer: {a.engineerId?.name} ({a.engineerId?.email})</div>
            <div>Project: {a.projectId?.name}</div>
            <div>Allocation: {a.allocationPercentage}%</div>
            <div>Role: {a.role}</div>
            <div>Start: {a.startDate?.slice(0, 10)} | End: {a.endDate?.slice(0, 10)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
