package sched

import (
	"testing"
	"time"

	"zakirullin/stuffbot/pkg/txt"

	"github.com/stretchr/testify/require"
)

func TestUcfirst(t *testing.T) {
	r := require.New(t)

	res := txt.Ucfirst("abc")

	r.Equal("Abc", res)
}

func TestUcfirstRu(t *testing.T) {
	r := require.New(t)

	res := txt.Ucfirst("абв")

	r.Equal("Абв", res)
}

func TestTomorrow(t *testing.T) {
	r := require.New(t)

	savedNow := now
	defer func() {
		now = savedNow
	}()
	now = func() time.Time {
		return time.Date(1970, 1, 1, 10, 45, 10, 0, time.UTC)
	}

	tomorrow := Tomorrow()
	r.Equal(time.Date(1970, 1, 2, 0, 0, 0, 0, time.UTC).Unix(), tomorrow)
}
