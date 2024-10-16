import React, { useEffect, useState } from 'react';
import * as SDK from 'azure-devops-extension-sdk';
import { IWorkItemFormService } from 'azure-devops-extension-api/WorkItemTracking';

interface Field {
  name: string;
  referenceName: string;
}

interface WorkItemTypeOrder {
  [key: string]: string[];
}

const App: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [workItemType, setWorkItemType] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      await SDK.init();
      const workItemFormService = await SDK.getService<IWorkItemFormService>('ms.vss-work-web.work-item-form');
      
      const fieldsList = await workItemFormService.getFields();
      const type = await workItemFormService.getFieldValue('System.WorkItemType') as string;
      
      setWorkItemType(type);
      setFields(sortFieldsCustomOrder(fieldsList, type));
    };

    init();
  }, []);

  const sortFieldsCustomOrder = (fields: Field[], workItemType: string): Field[] => {
    const workItemTypeOrders: WorkItemTypeOrder = {
      'Bug': ["System.Title", "System.Description", "Microsoft.VSTS.TCM.ReproSteps", "System.AssignedTo", "Microsoft.VSTS.Common.Priority"],
      'Epic': ["System.Title", "System.Description", "Custom.BusinessValue", "Custom.ReleaseDate", "System.AssignedTo"],
      'Feature': ["System.Title", "System.Description", "Custom.AcceptanceCriteria", "System.IterationPath", "System.AssignedTo"],
      'Task': ["System.Title", "System.Description", "Microsoft.VSTS.Scheduling.RemainingWork", "System.AssignedTo", "System.State"],
      // Add more work item types and their custom orders as needed
    };

    const order = workItemTypeOrders[workItemType] || [];

    return fields.sort((a, b) => {
      const indexA = order.indexOf(a.referenceName);
      const indexB = order.indexOf(b.referenceName);

      if (indexA === -1 && indexB === -1) {
        // If both fields are not in the custom order, sort alphabetically
        return a.name.localeCompare(b.name);
      }

      if (indexA === -1) return 1; // a is not in custom order, move to end
      if (indexB === -1) return -1; // b is not in custom order, move to end

      return indexA - indexB; // Sort based on custom order
    });
  };

  return (
    <div>
      <h1>Custom Field Order for {workItemType}</h1>
      <ul>
        {fields.map((field) => (
          <li key={field.referenceName}>{field.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;