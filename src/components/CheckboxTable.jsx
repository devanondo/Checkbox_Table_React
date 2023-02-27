import { cloneDeep } from "lodash";
import React, { useState } from "react";
import "./CheckboxTable.scss";

const transform = (data, parent) => {
  return Object.keys(data).map((key) => {
    const value = data[key];
    const node = {
      label: key,
      checked: false,
      childrenNodes: [],
      parent: parent,
    };

    if (typeof value === "boolean") {
      node.checked = value;
    } else {
      const children = transform(value, node);
      node.childrenNodes = children;
      if (children.every((node) => node.checked)) {
        node.checked = true;
      }
    }

    return node;
  });
};

const updateAncestors = (node) => {
  if (!node.parent) {
    return;
  }

  const parent = node.parent;
  if (parent.checked && !node.checked) {
    parent.checked = false;
    updateAncestors(parent);
    return;
  }

  if (!parent.checked && node.checked) {
    if (parent.childrenNodes.every((node) => node.checked)) {
      parent.checked = true;
      updateAncestors(parent);
      return;
    }
  }

  return;
};

const toggleDescendants = (node) => {
  const checked = node.checked;

  node.childrenNodes.forEach((node) => {
    node.checked = checked;
    toggleDescendants(node);
  });
};

const findNode = (nodes, label, ancestors) => {
  let node = undefined;
  if (ancestors.length === 0) {
    return nodes.filter((node) => node.label === label)[0];
  }

  for (let ancestor of ancestors) {
    const candidates = node ? node.childrenNodes : nodes;
    node = candidates.filter((node) => node.label === ancestor)[0];
  }
  return node?.childrenNodes.filter((node) => node.label === label)[0];
};

const NestedCheckbox = ({ data }) => {
  const initialNodes = transform(data);
  const [nodes, setNodes] = useState(initialNodes);

  const backData = (data, pacc) => {
    if (data.childrenNodes.length <= 0) {
      return;
    }

    return {
      ...pacc,
      [data.label]: data.childrenNodes.reduce((acc, cur) => {
        if (cur.childrenNodes.length === 0) {
          return { ...acc, [cur.label]: cur.checked };
        } else {
          return backData(cur, acc);
        }
      }, {}),
    };
  };

  const arr = nodes.map((item) => {
    return backData(item);
  });

  const obj = arr.reduce((acc, cur) => {
    const key = Object.keys(cur)[0];
    acc[key] = Object.values(cur)[0];
    return acc;
  }, {});

  const handleBoxChecked = (e, ancestors) => {
    const checked = e.currentTarget.checked;
    const node = findNode(nodes, e.currentTarget.value, ancestors);

    node.checked = checked;
    toggleDescendants(node);
    updateAncestors(node);

    setNodes(cloneDeep(nodes));
  };

  return (
    <NestedCheckboxHelper
      nodes={nodes}
      ancestors={[]}
      onBoxChecked={handleBoxChecked}
    />
  );
};

const NestedCheckboxHelper = ({ nodes, ancestors, onBoxChecked }) => {
  const prefix = ancestors.join(".");
  return (
    <ul>
      {nodes.map(({ label, checked, childrenNodes }) => {
        const id = `${prefix}.${label}`;
        let children = null;
        if (childrenNodes.length > 0) {
          children = (
            <NestedCheckboxHelper2
              nodes={childrenNodes}
              ancestors={[...ancestors, label]}
              onBoxChecked={onBoxChecked}
            />
          );
        }

        return (
          <li key={id} className={label}>
            <input
              type="checkbox"
              name={id}
              value={label}
              checked={checked}
              onChange={(e) => onBoxChecked(e, ancestors)}
              className={label + "checkbox"}
            />
            <label className={label} htmlFor={id}>
              {label}
            </label>
            {children}
          </li>
        );
      })}
    </ul>
  );
};

const NestedCheckboxHelper2 = ({ nodes, ancestors, onBoxChecked }) => {
  const prefix = ancestors.join(".");
  return (
    <div
      style={{
        display: `${nodes.length === 4 ? "flex" : null}`,
      }}
    >
      {nodes.map(({ label, checked, childrenNodes }, index) => {
        const id = `${prefix}.${label}`;
        let children = null;
        if (childrenNodes.length > 0) {
          children = (
            <NestedCheckboxHelper2
              nodes={childrenNodes}
              ancestors={[...ancestors, label]}
              onBoxChecked={onBoxChecked}
            />
          );
        }

        return (
          <div
            style={{
              display: `${childrenNodes.length === 4 ? "flex" : null}`,
              justifyContent: "space-between",
              background: `${(index + 1) % 2 == 0 ? "#e3e4e6" : "white"}`,
              margin: `${
                (index + 1) % 2 == 0 ? "0px 0 0px 30px" : "5px 0 5px 30px"
              }`,
            }}
            key={id}
            className={`${label} ${(index + 1) % 2 == 0 ? "even" : "odd"}`}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className={label}>{index + 1}</span>
              <input
                type="checkbox"
                name={id}
                value={label}
                checked={checked}
                onChange={(e) => onBoxChecked(e, ancestors)}
                className="checkbox"
              />
              <label className={label} htmlFor={id}>
                {label}
              </label>
            </div>
            {children}
          </div>
        );
      })}
    </div>
  );
};

export default function App(props) {
  const [permissions, setPermissions] = useState({
    all: {
      "Invoice (Air Ticket)": {
        create: true,
        edit: true,
        view: false,
        delete: true,
      },
      "Invoice (Non commission)": {
        create: true,
        edit: true,
        view: false,
        delete: true,
      },
      "Re Issue - Air Ticket": {
        create: true,
        edit: true,
        view: false,
        delete: true,
      },
      "Invoice (Other)": {
        create: true,
        edit: true,
        view: false,
        delete: true,
      },
      "Invoice (Visa)": {
        create: true,
        edit: true,
        view: false,
        delete: true,
      },
      "Invoice (Tour Package)": {
        create: true,
        edit: true,
        view: false,
        delete: true,
      },
      "Invoice (Hajj Pre Reg:)": {
        create: true,
        edit: true,
        view: false,
        delete: true,
      },
      "Hajji Management": {
        "Client 2 Client Transfer": {
          create: true,
          edit: true,
          view: false,
          delete: true,
        },
        "Transfer List (Client 2 Client)": {
          create: true,
          edit: true,
          view: false,
          delete: true,
        },
        "Group 2 Group Transfer": {
          create: true,
          edit: true,
          view: false,
          delete: true,
        },
        "Transfer List (Group 2 Group)": {
          create: true,
          edit: true,
          view: false,
          delete: true,
        },
        "Transfer In": {
          create: true,
          edit: true,
          view: false,
          delete: true,
        },
        "Transfer Out": {
          create: true,
          edit: true,
          view: false,
          delete: true,
        },
        "Cancel Pre-registration": {
          create: true,
          edit: true,
          view: false,
          delete: true,
        },
      },
    },
  });

  // const verifyPermissions = (route, permissionKeys, route2) => {
  //   if (route2) {
  //     return permissions.all[route][route2]?.[permissionKeys];
  //   } else {
  //     return permissions.all[route]?.[permissionKeys];
  //   }
  // };

  // console.log(
  //   verifyPermissions("Transfer List (Client 2 Client)", "create", "client1")
  // );

  return (
    <>
      <div className="permission_wrapper">
        <div className="permissions_table">
          <div className="module">
            <div className="left">Module</div>

            <ul>
              <li>Create</li>
              <li>Edit</li>
              <li>View</li>
              <li>Delete</li>
            </ul>
          </div>
          <NestedCheckbox data={permissions} ancestors={[]} />
        </div>
      </div>
    </>
  );
}
