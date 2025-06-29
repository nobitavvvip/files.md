package internal

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestReadMessagesEmpty(t *testing.T) {
	r := require.New(t)
	result := readMessages("")
	r.Empty(result)
}

func TestReadMessagesOnlyHeader(t *testing.T) {
	r := require.New(t)
	result := readMessages("#### 27 June, Friday")
	r.Equal([]string{"#### 27 June, Friday"}, result)
}

func TestReadMessagesSingleRecord(t *testing.T) {
	r := require.New(t)
	result := readMessages("`01:01` Simple record")
	r.Equal([]string{"`01:01` Simple record"}, result)
}

func TestReadMessagesHeaderWithRecord(t *testing.T) {
	r := require.New(t)
	content := "#### 27 June, Friday\n`01:01` Simple record"
	result := readMessages(content)
	r.Equal([]string{"#### 27 June, Friday", "`01:01` Simple record"}, result)
}

func TestReadMessagesMultilineRecord(t *testing.T) {
	r := require.New(t)
	content := "#### 27 June, Friday\n`01:01` Multiline\nc\nontent"
	result := readMessages(content)
	r.Equal([]string{"#### 27 June, Friday", "`01:01` Multiline\nc\nontent"}, result)
}

func TestReadMessagesMultipleRecords(t *testing.T) {
	r := require.New(t)
	content := "#### 27 June, Friday\n`01:01` First record\n`02:02` Second record"
	result := readMessages(content)
	r.Equal([]string{"#### 27 June, Friday", "`01:01` First record", "`02:02` Second record"}, result)
}

func TestReadMessagesMultipleHeaders(t *testing.T) {
	r := require.New(t)
	content := "#### 27 June, Friday\n`01:01` First day\n#### 28 June, Saturday\n`02:02` Second day"
	result := readMessages(content)
	r.Equal([]string{"#### 27 June, Friday", "`01:01` First day", "#### 28 June, Saturday", "`02:02` Second day"}, result)
}

func TestReadMessagesWindowsLineEndings(t *testing.T) {
	r := require.New(t)
	content := "#### 27 June, Friday\r\n`01:01` Windows record"
	result := readMessages(content)
	r.Equal([]string{"#### 27 June, Friday", "`01:01` Windows record"}, result)
}

func TestReadMessagesWithEmptyLines(t *testing.T) {
	r := require.New(t)
	content := "#### 27 June, Friday\n\n`01:01` Record with\n\nempty lines"
	result := readMessages(content)
	r.Equal([]string{"#### 27 June, Friday", "`01:01` Record with\n\nempty lines"}, result)
}

func TestReadMessagesInvalidTimestamp(t *testing.T) {
	r := require.New(t)
	content := "#### 27 June, Friday\n`not timestamp` Should be continuation\n`01:01` Real record"
	result := readMessages(content)
	r.Equal([]string{"#### 27 June, Friday", "`not timestamp` Should be continuation", "`01:01` Real record"}, result)
}
