
import { useEffect, useState } from 'react';
import { Alert } from '@/components/ui/alert';
import { useAuth } from '../components/useAuth';

export default function EngineerDashboard({ token }) {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:5000/api/assignments?engineerId=${user._id}`,
      { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setAssignments(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load assignments');
        setLoading(false);
      });
  }, [token, user]);

  if (loading) return <div>Loading assignments...</div>;
  if (error) return (
    <div className="mb-4">
      <Alert variant="destructive">{error}</Alert>
    </div>
  );

  // Sort assignments by start date (upcoming first)
  const sortedAssignments = [...assignments].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  // Calculate next available date
  const now = new Date();
  const futureAssignments = sortedAssignments.filter(a => new Date(a.endDate) > now);
  const nextAvailable = futureAssignments.length > 0 ? futureAssignments[futureAssignments.length - 1].endDate?.slice(0, 10) : 'Now';

  return (
    <div className="bg-neutral-light min-h-screen">
      <h2 className="text-xl font-bold mb-4 text-primary">Engineer Dashboard</h2>
      <div className="mb-4 text-black font-semibold">Availability: {futureAssignments.length === 0 ? 'Available now' : `Next available after ${nextAvailable}`}</div>
      {assignments.length === 0 ? (
        <Alert variant="info">No assignments found.</Alert>
      ) : (
        <ul>
          {sortedAssignments.map(assignment => (
            <li key={assignment._id} className="mb-2 p-2 border border-black rounded bg-gray-50">
              {assignment.projectId?.name && (
                <>
                  <div className="font-semibold text-black">Project: {assignment.projectId.name}</div>
                  <div className="text-black/80">{assignment.projectId.description}</div>
                </>
              )}
              {assignment.projectId?.managerId?.name && (
                <div className="text-black">Manager: {assignment.projectId.managerId.name} ({assignment.projectId.managerId.email})</div>
              )}
              <div className="text-black">Allocation: {assignment.allocationPercentage}%</div>
              <div className="text-black">Role: {assignment.role}</div>
              <div className="text-black">Start: {assignment.startDate?.slice(0, 10)}</div>
              <div className="text-black">End: {assignment.endDate?.slice(0, 10)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
