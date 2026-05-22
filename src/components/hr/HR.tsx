'use client'
import { useState } from 'react'
import { Users, Calendar, FileText, DollarSign, Shield, Zap, Plus, Upload } from 'lucide-react'
import { clsx } from 'clsx'
import { useAppStore } from '@/store/appStore'
import { Modal } from '@/components/common/Modal'

export function HR() {
  const { employees, addEmployee, complianceItems, addComplianceItem, addToast } = useAppStore()
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [showAddCompliance, setShowAddCompliance] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    role: '',
    dept: '',
    salary: ''
  })
  const [newCompliance, setNewCompliance] = useState({
    item: '',
    date: '',
    priority: 'medium'
  })

  const handleAddEmployee = () => {
    if (!newEmployee.name.trim()) {
      addToast('Please enter employee name', 'error')
      return
    }
    if (!newEmployee.role.trim()) {
      addToast('Please enter role', 'error')
      return
    }
    if (!newEmployee.dept.trim()) {
      addToast('Please enter department', 'error')
      return
    }
    
    addEmployee({
      id: `emp-${Date.now()}`,
      name: newEmployee.name,
      role: newEmployee.role,
      dept: newEmployee.dept,
      salary: newEmployee.salary || '₹0',
      status: 'active'
    })
    
    setNewEmployee({ name: '', role: '', dept: '', salary: '' })
    setShowAddEmployee(false)
    addToast('Employee added successfully', 'success')
  }

  const handleAddCompliance = () => {
    if (!newCompliance.item.trim()) {
      addToast('Please enter compliance item', 'error')
      return
    }
    if (!newCompliance.date) {
      addToast('Please select a date', 'error')
      return
    }
    
    const daysUntil = Math.floor((new Date(newCompliance.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    
    addComplianceItem({
      item: newCompliance.item,
      date: new Date(newCompliance.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      priority: newCompliance.priority as any,
      days: daysUntil
    })
    
    setNewCompliance({ item: '', date: '', priority: 'medium' })
    setShowAddCompliance(false)
    addToast('Compliance item added', 'success')
  }

  const handleRunPayroll = () => {
    addToast('Processing payroll...', 'info')
    setTimeout(() => {
      addToast('Payroll processed successfully for ' + employees.length + ' employees', 'success')
    }, 2000)
  }

  const handleUploadPolicy = (docName: string) => {
    addToast(`${docName} upload feature coming soon`, 'info')
  }

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">HR & Payroll</h1>
          <p className="text-muted">Employee management, payroll processing & compliance</p>
        </div>
        <button 
          onClick={handleRunPayroll}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-cyan-400 text-primary font-semibold"
        >
          <Zap size={18} />
          Run Payroll
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Total Employees', value: employees.length.toString(), icon: Users },
          { label: 'On Leave', value: employees.filter(e => e.status === 'on_leave').length.toString(), icon: Calendar, color: 'warning' },
          { label: 'Pending Payroll', value: employees.length > 0 ? `₹${(employees.length * 75000).toLocaleString()}` : '₹0', icon: DollarSign, color: 'accent' },
          { label: 'Compliance Items', value: complianceItems.length.toString(), icon: Shield, color: 'highlight' },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-5">
            <stat.icon size={20} className={clsx('mb-3', stat.color ? `text-${stat.color}` : 'text-accent')} />
            <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
            <p className="text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Employee Directory */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-display font-semibold text-white">Employee Directory</h3>
            <button 
              onClick={() => setShowAddEmployee(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-primary font-medium"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
          
          {employees.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <Users size={48} className="text-muted mb-4" />
              <h3 className="text-xl font-display font-semibold text-white mb-2">No employees yet</h3>
              <p className="text-muted text-center mb-6">Add employees to manage your workforce</p>
              <button 
                onClick={() => setShowAddEmployee(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-primary font-semibold"
              >
                <Plus size={18} />
                Add Employee
              </button>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {employees.map((emp) => (
                <div key={emp.id} className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-cyan-400 flex items-center justify-center text-primary font-bold">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{emp.name}</h4>
                      <p className="text-sm text-muted">{emp.role} • {emp.dept}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{emp.salary}</p>
                      <span className={clsx(
                        'px-2 py-1 rounded-full text-xs',
                        emp.status === 'active' && 'bg-success/20 text-success',
                        emp.status === 'on_leave' && 'bg-warning/20 text-warning',
                      )}>
                        {emp.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Compliance Alerts */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-display font-semibold text-white">Compliance Calendar</h3>
            <button 
              onClick={() => setShowAddCompliance(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
          
          {complianceItems.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <Calendar size={48} className="text-muted mb-4" />
              <h3 className="text-xl font-display font-semibold text-white mb-2">No upcoming deadlines</h3>
              <p className="text-muted text-center">Add compliance items to track deadlines</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {complianceItems.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                  <div className="w-14 text-center">
                    <p className="text-xs text-muted">{item.date.split(' ')[0]}</p>
                    <p className="text-xl font-bold text-white">{item.date.split(' ')[1]}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{item.item}</p>
                    <p className="text-sm text-muted">in {item.days} days</p>
                  </div>
                  <span className={clsx(
                    'px-3 py-1 rounded-full text-xs font-medium uppercase',
                    item.priority === 'high' && 'bg-highlight/20 text-highlight',
                    item.priority === 'medium' && 'bg-warning/20 text-warning',
                    item.priority === 'low' && 'bg-success/20 text-success',
                  )}>
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Documents */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-display font-semibold text-white mb-4">Policy Documents</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: 'Employee Handbook', icon: FileText },
            { name: 'Leave Policy', icon: Calendar },
            { name: 'Code of Conduct', icon: Shield },
          ].map((doc, i) => (
            <button 
              key={i}
              onClick={() => handleUploadPolicy(doc.name)}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left group"
            >
              <doc.icon size={24} className="text-muted group-hover:text-accent transition-colors" />
              <div>
                <p className="text-white font-medium">{doc.name}</p>
                <p className="text-sm text-muted">Click to upload</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <Modal title="Add New Employee" onClose={() => setShowAddEmployee(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted mb-2">Full Name *</label>
              <input
                type="text"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                placeholder="Enter full name"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-muted focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Role / Designation *</label>
              <input
                type="text"
                value={newEmployee.role}
                onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                placeholder="e.g. Sales Manager"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-muted focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Department *</label>
              <select
                value={newEmployee.dept}
                onChange={(e) => setNewEmployee({ ...newEmployee, dept: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent"
              >
                <option value="">Select Department</option>
                <option value="Sales">Sales</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
                <option value="IT">IT</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Monthly Salary</label>
              <input
                type="text"
                value={newEmployee.salary}
                onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                placeholder="e.g. ₹75,000"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-muted focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setShowAddEmployee(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddEmployee}
                className="flex-1 px-4 py-3 rounded-xl bg-accent text-primary font-semibold hover:bg-accent/80"
              >
                Add Employee
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Compliance Modal */}
      {showAddCompliance && (
        <Modal title="Add Compliance Item" onClose={() => setShowAddCompliance(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted mb-2">Compliance Item *</label>
              <input
                type="text"
                value={newCompliance.item}
                onChange={(e) => setNewCompliance({ ...newCompliance, item: e.target.value })}
                placeholder="e.g. PF Filing Due"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-muted focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Due Date *</label>
              <input
                type="date"
                value={newCompliance.date}
                onChange={(e) => setNewCompliance({ ...newCompliance, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Priority</label>
              <select
                value={newCompliance.priority}
                onChange={(e) => setNewCompliance({ ...newCompliance, priority: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setShowAddCompliance(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddCompliance}
                className="flex-1 px-4 py-3 rounded-xl bg-accent text-primary font-semibold hover:bg-accent/80"
              >
                Add Item
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
