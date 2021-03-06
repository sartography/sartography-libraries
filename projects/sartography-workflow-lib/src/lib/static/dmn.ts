export const DMN_DIAGRAM_DEFAULT = `
<?xml version="1.0" encoding="UTF-8"?>
<definitions
  xmlns="http://www.omg.org/spec/DMN/20151101/dmn.xsd"
  xmlns:biodi="http://bpmn.io/schema/dmn/biodi/1.0"
  id="Definitions_REPLACE_ME"
  name="DRD"
  namespace="http://camunda.org/schema/1.0/dmn"
>
  <decision id="Decision_REPLACE_ME" name="Decision 1">
    <extensionElements>
      <biodi:bounds x="157" y="81" width="180" height="80" />
    </extensionElements>
    <decisionTable id="decisionTable_1">
      <input id="input_1">
        <inputExpression id="inputExpression_1" typeRef="string">
          <text></text>
        </inputExpression>
      </input>
      <output id="output_1" typeRef="string" />
    </decisionTable>
  </decision>
</definitions>
`;
