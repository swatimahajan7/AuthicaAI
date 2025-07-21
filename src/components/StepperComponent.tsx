import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import { StepLabel } from '@mui/material';
import './StepperComponent.css'

interface StepperComponentProps {
  steps: Array<string>;
  activeStepNumber: number;
  completed: { [k: number]: boolean; }
}

const StepperComponent = ({ steps, activeStepNumber, completed }: StepperComponentProps) => {
  return (
    <Stepper activeStep={activeStepNumber} className='stepper-wrapper'>
      {steps.map((label, index) => (
        <Step key={label} completed={completed[index]}>
          <StepLabel className='step-label'></StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}

export default StepperComponent